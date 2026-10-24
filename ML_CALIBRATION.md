# PCNS personalized PDR calibration

PCNS includes a small supervised linear regression model for estimating a user's stride length. The model solves:

`distance_m = stride_length_m × detected_steps`

using least-squares fitting through the origin. It is an interpretable calibration model intended to improve PDR distance estimates. It is not a learned room classifier or a full end-to-end indoor localization model.

## Collect reliable training samples

1. Find a straight, safe, measured route on a single floor (for example, 10 m or 20 m marked out with a tape measure).
2. Enter Indoor mode at an anchor and walk the measured route at your normal pace while the step detector counts steps. For each walk, record the number of detected steps and the measured ground-truth distance in metres.
3. Enter **Admin → Personalized PDR model**, add the sample, and repeat for at least two walks. Prefer 5–10 walks at multiple distances and normal walking speeds.
4. Press **Train model**. PCNS fits a step-length coefficient, reports mean absolute error (MAE) and root mean squared error (RMSE), saves the model in this browser, and uses the fitted coefficient for future PDR steps.
5. Validate on a new measured walk that was not used to fit the model. If performance is poor, check step detection, measurement accuracy, and sensor permissions before collecting more samples.

Do not use randomly chosen distances or simulated steps as ground-truth training examples. For a research-grade full indoor localization model, collect synchronized labelled trajectories across phones, floors, headings, acceleration and gyroscope samples, then train and evaluate a model on held-out trajectories/users. The current model only personalizes step length.
