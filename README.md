
# SOICT 2024

# Title
GeoSI - An interesting interactive system to assist people in retrieving news from multiple online sources and mapping it through maps

# Authors
| No. | Author                        | Email |
|-----|-------------------------------|-------|
| 1   | Minh-Nhat Nguyen<sup>*</sup>           | 21120107@student.hcmus.edu.vn |
| 2   | Trong-Nghia Tran<sup>*</sup> | 21120507@student.hcmus.edu.vn |
| 3   | Minh-Triet Tran<sup>**</sup>  | tmtriet@fit.hcmus.edu.vn |

*<sup>*</sup>*  Both authors contribute equally.
*<sup>**</sup>*  Corresponding author


# Description
This source code implements GeoSI, submitted to SOICT 2024. It is a question-answering system that utilizes the latest online data and organizes information on a map to analyze trends specific to different regions.

# Workflow
<!-- ![Overall Workflow](assets/overall_flow.png "Overall Workflow") -->

<center>
  <iframe src="OverviewArchitecture.pdf" width="600" height="400"></iframe>
  <figcaption>Overall Workflow</figcaption>
</center>

# Instruction for evaluating source code
Please refer [`icmr2024_cheapfakes_challenge.ipynb`](icmr2024_cheapfake_challenge.ipynb) for setup environment and running experiment on Colab

**Note:** This experiment can be run on Google Colab Pro with **A100 GPU + High-ram runtime**

# Experimental Result
## Dataset
In our experiment, we use the original dataset taken from the ICMR 2024 Grand Challenge on Detecting Cheapfakes with 1000 samples in public test set. Each of which consisted of an image and two captions as inputs, along with the corresponding OOC (labeled as 1) or NOOC (labeled as 0) labels.

## Metrics
### Effectiveness
Notation:
* $TP$ is the number of true positive predictions (detected OOC)
* $TN$ is the number of true negative predictions (detected
NOOC).
* $FP$ is the number of false positive predictions (NOOC but
predicted as OOC).
* $FN$ is the number of false negative predictions (OOC but predicted as NOOC).

We use **accuracy, average precision (AP)** and **F1-score** to evaluate our proposed method in this challenge.

* **Accuracy** is defined as the ratio of correct predictions to the number of samples in the test set. The formula for accuracy is as follows:

$$ \text{accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

* **Average Precision** summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight:

$$\text{AP} = \sum_n (R_n - R_{n-1}) P_n$$

where $P_n$ and $R_n$ are the precision and recall at the nth threshold.

* **F1-score** can be interpreted as a harmonic mean of the precision and recall, where an F1 score reaches its best value at 1 and worst score at 0. The relative contribution of precision and recall to the F1 score are equal. The formula for the F1-score is:

$$ \text{F1} = \frac{2*TP}{2 * TP + FP + FN} $$

### Efficiency
**Number of Parameters, Total inference time (on 1000 test cases), Average inference time (per test case), and Model Size (storage size in MBs)** are the metrics that used to evaluate the efficiency of our method.

Explanation: We cannot use FLOPs to evaluate our method for the following reasons:

* Because our proposed method used many models (COSMOS Baseline, LLM - LLaMa, GILL) with different small tasks, it is very difficult to calculate the flop

* Moreover, we do not have enough time to modify the source code and run experiments again

**Solution**: As we want to evaluate the real-time performance of the method, we use "Inference time" metric - the time it takes the model to process a test case.

## Result
For "effectiveness" metrics:
* Accuracy: 82.9%
* Average Precision (AP): 78.29%
* F1-Score: 82.13%

For "efficiency" metrics:
* Total inference time (second) (on 1000 test cases): 6997.37s
* Average inference time (second) : 6.9974s/test case
* Number of parameters: 14363775579
* Model Size: 18584.07 MB
