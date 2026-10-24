/* PCNS supervised calibration model.
 * Fits distance = strideLengthM * detectedSteps using least squares through the origin.
 * This calibrates PDR step length; it is not a complete indoor localization model.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PCNSML = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function fitStrideModel(samples) {
    if (!Array.isArray(samples) || samples.length < 2) {
      throw new Error("At least two measured walks are required to train the model.");
    }
    const clean = samples.map((sample, index) => {
      const steps = Number(sample.steps);
      const distanceM = Number(sample.distanceM ?? sample.distance);
      if (!Number.isInteger(steps) || steps < 1 || steps > 100000 ||
          !Number.isFinite(distanceM) || distanceM <= 0 || distanceM > 5000) {
        throw new Error(`Calibration sample ${index + 1} is invalid.`);
      }
      return { steps, distanceM };
    });

    let numerator = 0;
    let denominator = 0;
    for (const sample of clean) {
      numerator += sample.steps * sample.distanceM;
      denominator += sample.steps * sample.steps;
    }
    if (denominator <= 0) throw new Error("No usable step data was supplied.");

    const strideLengthM = numerator / denominator;
    if (!Number.isFinite(strideLengthM) || strideLengthM < 0.25 || strideLengthM > 1.8) {
      throw new Error(`The fitted stride (${strideLengthM.toFixed(3)} m) is outside the safe range 0.25–1.80 m. Check the measured distances and step counts.`);
    }

    const meanDistance = clean.reduce((sum, sample) => sum + sample.distanceM, 0) / clean.length;
    let squaredError = 0;
    let absoluteError = 0;
    let totalVariance = 0;
    for (const sample of clean) {
      const residual = sample.distanceM - strideLengthM * sample.steps;
      squaredError += residual * residual;
      absoluteError += Math.abs(residual);
      totalVariance += (sample.distanceM - meanDistance) ** 2;
    }
    const rmse = Math.sqrt(squaredError / clean.length);
    const mae = absoluteError / clean.length;
    const r2 = totalVariance > 0 ? 1 - squaredError / totalVariance : null;
    return {
      modelType: "supervised-linear-stride-regression-v1",
      strideLengthM,
      sampleCount: clean.length,
      rmseM: rmse,
      maeM: mae,
      r2,
      trainedAt: new Date().toISOString(),
    };
  }

  function predictDistance(model, steps) {
    if (!model || !Number.isFinite(model.strideLengthM) || !Number.isFinite(steps) || steps < 0) {
      throw new Error("A valid trained model and non-negative step count are required.");
    }
    return model.strideLengthM * steps;
  }

  return { fitStrideModel, predictDistance };
});
