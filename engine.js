/* TireMath engine - honest tire math. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TireMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function parseSize(str) {
    var m = /^\s*(\d{3})\s*\/\s*(\d{2})\s*[rR]\s*(\d{2})\s*$/.exec(str || '');
    if (!m) return null;
    return { width: +m[1], aspect: +m[2], rim: +m[3] };
  }

  // Overall diameter in mm: rim + two sidewalls (sidewall = width * aspect%).
  function diameterMm(size) {
    var sidewall = size.width * size.aspect / 100;
    return size.rim * 25.4 + 2 * sidewall;
  }

  function diameterIn(size) { return Math.round(diameterMm(size) / 25.4 * 100) / 100; }

  // Revolutions per mile.
  function revsPerMile(size) {
    var circM = Math.PI * diameterMm(size) / 1000;
    return Math.round(1609.344 / circM);
  }

  // Changing size: how far off the speedometer goes. Positive = you are faster than indicated.
  function speedoError(stock, swapped) {
    return Math.round((diameterMm(swapped) / diameterMm(stock) - 1) * 1000) / 10; // percent
  }

  function sizeVerdict(errPct) {
    var a = Math.abs(errPct);
    if (a <= 1.5) return { code: 'invisible', label: 'Invisible change' };
    if (a <= 3) return { code: 'acceptable', label: 'Acceptable - inside the 3% rule' };
    return { code: 'off-limits', label: 'Outside the 3% rule - gearing, ABS and clearance suffer' };
  }

  // Tread: new ~10/32. Legal 2/32. Honest wet limit 4/32. Snow 6/32.
  var TREAD_LIMITS = { legal: 2, rain: 4, snow: 6 };

  function treadVerdict(tread32) {
    if (tread32 <= TREAD_LIMITS.legal) return { code: 'illegal', label: 'Past the legal limit' };
    if (tread32 <= TREAD_LIMITS.rain) return { code: 'wet-risk', label: 'Legal, but rain grip is gone' };
    if (tread32 <= TREAD_LIMITS.snow) return { code: 'no-snow', label: 'Fine in rain, done in snow' };
    return { code: 'healthy', label: 'Healthy tread' };
  }

  // Honest remaining miles: linear wear from measured wear rate (32nds per 10k miles), to a chosen floor.
  function milesLeft(tread32, wearPer10k, floor) {
    if (wearPer10k <= 0) return Infinity;
    return Math.round(Math.max(0, tread32 - floor) / wearPer10k * 10000);
  }

  // Tire age from DOT code (week, year). Six years is the honest ceiling, ten the absolute wall.
  function ageVerdict(dotWeek, dotYear, nowYear) {
    var age = nowYear - dotYear;
    if (dotYear < 2000) return { code: 'ancient', label: 'Pre-2000 DOT - replace regardless' };
    if (age >= 10) return { code: 'replace', label: 'Past the 10-year wall - replace regardless of tread' };
    if (age >= 6) return { code: 'old', label: 'Past 6 years - rubber hardens, inspect yearly' };
    return { code: 'fresh', label: 'Young rubber' };
  }

  // Penny-test honesty: the penny sees 2/32 (legal floor), not the 4/32 you actually want in rain.
  function pennyTruth(tread32) {
    if (tread32 <= 2) return 'Fails the penny test - legally bald';
    if (tread32 <= 4) return 'PASSES the penny test - and that is exactly the trap. Rain grip is already gone at 4/32';
    return 'Passes the penny test with room';
  }

  return {
    parseSize: parseSize,
    diameterMm: diameterMm,
    diameterIn: diameterIn,
    revsPerMile: revsPerMile,
    speedoError: speedoError,
    sizeVerdict: sizeVerdict,
    TREAD_LIMITS: TREAD_LIMITS,
    treadVerdict: treadVerdict,
    milesLeft: milesLeft,
    ageVerdict: ageVerdict,
    pennyTruth: pennyTruth
  };
});
