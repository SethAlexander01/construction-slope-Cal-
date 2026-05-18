/* ============================================================
   EXCAVATION SLOPE CALCULATOR — script.js
   All calculation logic, unit conversion, and UI behavior.
   ============================================================ */

/* ── Slope Configuration ─────────────────────────────────────
   Ratio = horizontal feet per 1 vertical foot of depth.
   Source: OSHA 29 CFR 1926.652, Appendix B.
   ─────────────────────────────────────────────────────────── */
const SOIL_DATA = {
  'stable-rock': {
    ratio:   0,
    label:   'Vertical (0 : 1)',
    note:    'Stable Rock — vertical walls are permitted. No horizontal setback is required.',
  },
  'type-a': {
    ratio:   0.75,
    label:   '¾ : 1  (0.75 H : 1 V)',
    note:    'Type A Soil — slope ratio ¾:1 per OSHA 1926.652 Appendix B. Most stable soil classification.',
  },
  'type-b': {
    ratio:   1.0,
    label:   '1 : 1  (1.0 H : 1 V)',
    note:    'Type B Soil — slope ratio 1:1 per OSHA 1926.652 Appendix B. Moderate stability.',
  },
  'type-c': {
    ratio:   1.5,
    label:   '1½ : 1  (1.5 H : 1 V)',
    note:    'Type C Soil — slope ratio 1½:1 per OSHA 1926.652 Appendix B. Least stable classification.',
  },
};

/* Conversion constant: 1 foot = 0.3048 meters */
const FT_TO_M = 0.3048;

/* ── State ───────────────────────────────────────────────────
   Track which unit is currently active.
   ─────────────────────────────────────────────────────────── */
let currentUnit = 'ft'; // 'ft' or 'm'

/* ================================================================
   DOM REFERENCES
   Grab all the elements we'll need.
================================================================ */
const depthInput        = document.getElementById('depth');
const soilTypeSelect    = document.getElementById('soil-type');
const bottomWidthInput  = document.getElementById('bottom-width');
const trenchLengthInput = document.getElementById('trench-length');
const unitFtRadio       = document.getElementById('unit-ft');
const unitMRadio        = document.getElementById('unit-m');

const resultRatio       = document.getElementById('result-ratio');
const resultSetback     = document.getElementById('result-setback');
const resultTopWidth    = document.getElementById('result-top-width');
const resultFootprint   = document.getElementById('result-footprint');
const footprintRow      = document.getElementById('footprint-row');
const safetyNote        = document.getElementById('safety-note');

const warning5ft        = document.getElementById('warning-5ft');
const warning20ft       = document.getElementById('warning-20ft');

const resetBtn          = document.getElementById('reset-btn');
const printBtn          = document.getElementById('print-btn');
const copyBtn           = document.getElementById('copy-btn');

/* All the "(ft)" / "(m)" labels in the form */
const unitLabels        = document.querySelectorAll('.unit-label');

/* ================================================================
   UTILITY FUNCTIONS
================================================================ */

/**
 * Round to 2 decimal places, removing trailing zeros.
 * e.g. 10.00 → "10", 4.50 → "4.5", 1.25 → "1.25"
 */
function fmt(num) {
  return parseFloat(num.toFixed(2)).toString();
}

/**
 * Convert a value from feet to the current display unit.
 * If currentUnit is 'm', multiply by FT_TO_M.
 */
function toDisplay(feet) {
  return currentUnit === 'm' ? feet * FT_TO_M : feet;
}

/**
 * Convert a value from the current display unit back to feet.
 * Used to normalize user inputs before calculation.
 */
function toFeet(val) {
  return currentUnit === 'm' ? val / FT_TO_M : val;
}

/**
 * Return "ft" or "m²" based on current unit.
 */
function unitStr() {
  return currentUnit === 'm' ? 'm' : 'ft';
}

function areaUnitStr() {
  return currentUnit === 'm' ? 'm²' : 'sq ft';
}

/* ================================================================
   MAIN CALCULATE FUNCTION
   Called on every input change. Reads inputs, computes results,
   and updates the DOM.
================================================================ */
function calculate() {
  const rawDepth       = parseFloat(depthInput.value);
  const rawBottomWidth = parseFloat(bottomWidthInput.value);
  const rawLength      = parseFloat(trenchLengthInput.value);
  const soilKey        = soilTypeSelect.value;

  /* ── Validate depth ── */
  if (isNaN(rawDepth) || rawDepth <= 0) {
    clearResults();
    return;
  }

  /* ── Resolve bottom width (default: 2 ft equivalent) ── */
  const defaultBottomWidth = currentUnit === 'm' ? 2 * FT_TO_M : 2;
  const effectiveBottomWidth = (isNaN(rawBottomWidth) || rawBottomWidth < 0)
    ? defaultBottomWidth
    : rawBottomWidth;

  /* ── Convert inputs to feet for internal math ── */
  const depthFt       = toFeet(rawDepth);
  const bottomWidthFt = toFeet(effectiveBottomWidth);
  const hasLength     = !isNaN(rawLength) && rawLength > 0;
  const lengthFt      = hasLength ? toFeet(rawLength) : null;

  /* ── Retrieve slope config for chosen soil type ── */
  const soil = SOIL_DATA[soilKey];

  /* ── Core geometry calculations (all in feet) ── */
  const setbackFt  = depthFt * soil.ratio;                 // horizontal setback per side
  const topWidthFt = bottomWidthFt + (2 * setbackFt);      // total top opening width

  /* ── Update: Slope Ratio ── */
  resultRatio.textContent = soil.label;

  /* ── Update: Horizontal Setback ── */
  if (soilKey === 'stable-rock') {
    resultSetback.textContent = `0 ${unitStr()} (vertical walls allowed)`;
  } else {
    resultSetback.textContent = `${fmt(toDisplay(setbackFt))} ${unitStr()} per side`;
  }

  /* ── Update: Top Opening Width ── */
  resultTopWidth.textContent = `${fmt(toDisplay(topWidthFt))} ${unitStr()}`;

  /* ── Update: Footprint Area (only if trench length was entered) ── */
  if (hasLength) {
    // Area in sq ft, then convert to display unit if needed
    const areaDisplay = currentUnit === 'm'
      ? (toDisplay(topWidthFt) * toDisplay(lengthFt))   // m × m = m²
      : (topWidthFt * lengthFt);                         // ft × ft = sq ft

    resultFootprint.textContent = `${fmt(areaDisplay)} ${areaUnitStr()}`;
    footprintRow.style.display  = '';
  } else {
    resultFootprint.textContent = '—';
    footprintRow.style.display  = '';
  }

  /* ── Update: Safety Note ── */
  const depthDisplay      = fmt(toDisplay(depthFt));
  const bottomDisplay     = fmt(toDisplay(bottomWidthFt));
  const topWidthDisplay   = fmt(toDisplay(topWidthFt));
  const setbackDisplay    = fmt(toDisplay(setbackFt));

  if (soilKey === 'stable-rock') {
    safetyNote.textContent =
      `Stable Rock: vertical excavation walls are permitted. ` +
      `No horizontal setback is required for a ${depthDisplay} ${unitStr()} deep excavation.`;
  } else {
    safetyNote.textContent =
      `${soil.note} ` +
      `For a ${depthDisplay} ${unitStr()} deep trench with a ${bottomDisplay} ${unitStr()} wide bottom, ` +
      `cut back ${setbackDisplay} ${unitStr()} on each side — ` +
      `giving an estimated top opening of ${topWidthDisplay} ${unitStr()} wide.`;
  }

  /* ── Depth Warnings ── */
  /* Always compare against feet, since OSHA thresholds are in feet */
  warning5ft.classList.toggle('hidden', depthFt < 5);
  warning20ft.classList.toggle('hidden', depthFt < 20);
}

/* ================================================================
   CLEAR RESULTS
   Reset the results panel to its blank state.
================================================================ */
function clearResults() {
  resultRatio.textContent     = '—';
  resultSetback.textContent   = '—';
  resultTopWidth.textContent  = '—';
  resultFootprint.textContent = '—';
  safetyNote.textContent      = 'Enter a depth and soil type above to see your safety summary.';
  warning5ft.classList.add('hidden');
  warning20ft.classList.add('hidden');
}

/* ================================================================
   RESET FORM
   Clear all inputs and return to defaults.
================================================================ */
function resetForm() {
  depthInput.value        = '';
  bottomWidthInput.value  = '2';   // always reset to 2 ft
  trenchLengthInput.value = '';
  soilTypeSelect.value    = 'type-b';

  /* Also reset unit to feet */
  unitFtRadio.checked = true;
  currentUnit = 'ft';
  updateUnitLabels('ft');

  clearResults();
  depthInput.focus();
}

/* ================================================================
   UNIT TOGGLE
   When the user switches between ft and m, convert all existing
   input values to the new unit so the numbers stay consistent.
================================================================ */
function handleUnitChange(newUnit) {
  if (newUnit === currentUnit) return;

  /* Convert any values already entered in the inputs */
  convertInput(depthInput, newUnit);
  convertInput(bottomWidthInput, newUnit);
  convertInput(trenchLengthInput, newUnit);

  currentUnit = newUnit;
  updateUnitLabels(newUnit);
  calculate();
}

/**
 * Convert a single input's value between ft and m.
 * newUnit is the unit we're switching TO.
 */
function convertInput(input, newUnit) {
  const val = parseFloat(input.value);
  if (isNaN(val)) return;

  if (newUnit === 'm') {
    input.value = fmt(val * FT_TO_M);   // feet → meters
  } else {
    input.value = fmt(val / FT_TO_M);   // meters → feet
  }
}

/**
 * Update all "(ft)" / "(m)" labels throughout the form.
 */
function updateUnitLabels(unit) {
  unitLabels.forEach(function(label) {
    label.textContent = '(' + unit + ')';
  });
}

/* ================================================================
   COPY RESULTS
   Build a plain-text summary and copy it to the clipboard.
================================================================ */
function copyResults() {
  const ratio     = resultRatio.textContent;
  const setback   = resultSetback.textContent;
  const topWidth  = resultTopWidth.textContent;
  const footprint = resultFootprint.textContent;
  const note      = safetyNote.textContent;

  /* Build the text block */
  const lines = [
    'EXCAVATION SLOPE CALCULATOR — Results',
    '=======================================',
    'Slope Ratio (H:V)         : ' + ratio,
    'Horizontal Setback/Side   : ' + setback,
    'Estimated Top Width       : ' + topWidth,
    'Footprint Area            : ' + footprint,
    '',
    'Safety Note: ' + note,
    '',
    'DISCLAIMER: This is a planning estimate only.',
    'Always comply with OSHA 29 CFR 1926 Subpart P and',
    'consult a competent person and licensed engineer.',
  ];

  const text = lines.join('\n');

  navigator.clipboard.writeText(text).then(function() {
    /* Visual feedback — temporarily change button text */
    copyBtn.textContent = 'Copied!';
    setTimeout(function() { copyBtn.textContent = 'Copy Results'; }, 2200);
  }).catch(function() {
    /* Fallback if clipboard API is blocked */
    alert('Unable to copy automatically.\n\nPlease select and copy the results manually.');
  });
}

/* ================================================================
   FAQ ACCORDION
   Toggle open/closed on click, close others.
================================================================ */
function initFAQ() {
  var questions = document.querySelectorAll('.faq-question');

  questions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      /* Close all FAQ items first */
      questions.forEach(function(other) {
        other.setAttribute('aria-expanded', 'false');
        if (other.nextElementSibling) {
          other.nextElementSibling.classList.remove('open');
        }
      });

      /* If it wasn't open, open it now */
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}

/* ================================================================
   EVENT LISTENERS
   Wire up inputs, buttons, and unit radios.
================================================================ */

/* Recalculate instantly on any input change */
depthInput.addEventListener('input', calculate);
soilTypeSelect.addEventListener('change', calculate);
bottomWidthInput.addEventListener('input', calculate);
trenchLengthInput.addEventListener('input', calculate);

/* Unit toggle */
unitFtRadio.addEventListener('change', function() { handleUnitChange('ft'); });
unitMRadio.addEventListener('change',  function() { handleUnitChange('m'); });

/* Button actions */
resetBtn.addEventListener('click', resetForm);
printBtn.addEventListener('click', function() { window.print(); });
copyBtn.addEventListener('click',  copyResults);

/* ================================================================
   INITIALIZE
   Run once the DOM is ready.
================================================================ */
document.addEventListener('DOMContentLoaded', function() {
  initFAQ();
  /* Run calculate once with the defaults so results are visible on load */
  calculate();
});
