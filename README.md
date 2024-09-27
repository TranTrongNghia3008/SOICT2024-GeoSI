
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
<center>
  <img
    src="OverviewArchitecture.png"
  >
  <figcaption>Overall Workflow</figcaption>
</center>

# Testing pipeline

Please refer to this [Colab link](https://colab.research.google.com/drive/15RsJgG7nXEvnN5-ERo7MhZtJWrqoCxQO?usp=sharing) to run a test of the system's pipeline.

# Compare the results of the Q&A responses
- **Question 1:** Give me the current climate change situation on vnexpress website
	- Gemini:  ![Response of Gemini](results/Gemini1.png "Response of Gemini")
	- BingAI:	![Response of BingAI](results/Bing1.png "Response of BingAI") 
	- ChatGPT:	![Response of ChatGPT](results/ChatGPT1.png "Response of ChatGPT") 
	- GeoSI: ![Response of GeoSI](results/GeoSI1.png "Response of GeoSI") 
		
- **Question 2:** Severe flooding and emergencies due to Typhoon Yagi.
	- Gemini:  ![Response of Gemini](results/Gemini2.png "Response of Gemini")
	- BingAI:	![Response of BingAI](results/Bing2.png "Response of BingAI") 
	- ChatGPT:	![Response of ChatGPT](results/ChatGPT2.png "Response of ChatGPT") 
	- GeoSI: ![Response of GeoSI](results/GeoSI2.png "Response of GeoSI")
