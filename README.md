About:

- The focus of this study is on image classification. Image classification involves the process of categorizing and labeling groups of pixels or vectors within an image based on specific rules. 
- This study aim to propose a machine learning model that is able to classify images with high accuracy.
- This study aim to compare the performance of the models from both traditional machine learning and deep learning with different enhancement method.
- Various enhancement such as hybrid, ensemble or reinforcement learning were made to the traditional and deep learning models to obtain the proposed model for classifying image with high accuracy. 

Dataset:

- The dataset chosen is the CIFAR-10 dataset. 
- The dataset consists of **60000** color images with the size of 32 x 32 and has 3 channels which are R, G and B. Each image in the dataset is labeled with 1 of the 10 classes which are airplane, automobile, bird, cat, deer, dog, frog, horse, ship, and truck. There are a total of 6000 images for each class with 5000 images in the train dataset and 1000 images in the test dataset

Data Preprocessing:

1) Scaling: Normalize the pixel values to a standard range within (0, 1)
   
3) Image augmentation:  Generate additional training data by applying random transformations (Horizontally flipping the image, Rotating the image, and Shifting the image left or right and up and down) to existing images, helping to improve the generalization of the model.
   
4) Histogram of oriented gradients (HOG): Capture edge and shape information in images by computing the distribution of gradient orientations.
   
5) Principal component analysis (PCA): Reduce the dimensionality of large datasets by transforming the large set of features into a smaller one while still retaining most of the information.
   
--------------------------------------------------------------------------------------------------------------------------------

Individual Model Parameter Tuning:
1) Random Search
2) Bayesian Optimization
   
   LightGBM: 
   - num_leaves: [10,12,14,16,18,20]
   - min_child_samples: [20,30,40]
   - max_depth: [10,12,13]
   - min_split_gain: [10,11,12]
   - boosting_type: [gbdt,dart]
   
   KNN
   - n_neighbors: [1,5,10,15,20]
   - weights: [uniform, distance]
   - metric: [minkowski,euclidean,manhattan]
   - lgorithm: [auto, ball_tree, kd_tree, brute]
   
   Logistic Regression
   - solver: [newton-cg, sag, saga,lbfgs]
   - C: [100, 10, 1.0, 0.1, 0.01,0.001]

Machine Learning Ensemble Model:
- **Stacking, Voting, and Bagging Ensemble model was proposed further to improve the image classification on the CIFAR-10 dataset to overcome the limitation of the baseline model in classifying images.**

--------------------------------------------------------------------------------------------------------------------------------

Training parameters for Voting and Stacking model: LGBM-KNN
LGBMClassifier
- learning_rate=0.02375374380489134
- max_depth=11
- min_child_samples=15
- num_leaves=49
- random_state=42
- reg_alpha=0.16183089874674544

KNeighborsClassifier
- algorithm='ball_tree'
- metric='manhattan'
- n_neighbors=10

Training parameters for Voting and Stacking model: LGBM-KNN-LR
LGBMClassifier
- learning_rate=0.02375374380489134
- max_depth=11
- min_child_samples=15
- num_leaves=49
- random_state=42
- reg_alpha=0.16183089874674544

KNeighborsClassifier
- algorithm='ball_tree'
- metric='manhattan'
- n_neighbors=10

Logistic Regression
- C=100
- random_state=42
- solver='saga

Training parameters for Bagging model: LGBM
- learning_rate=0.02375374380489134
- max_depth=11
- min_child_samples=15
- num_leaves=49
- random_state=42
  reg_alpha=0.16183089874674544

Reinforcement Learning

Deep Learning Models:
- Hybrid CNN+ANN
- Hybrid CNN + ML (LGBM + SVM)

--------------------------------------------------------------------------------------------------------------------------------

Results:
1) Individual Models

   - Scale Results
     
![image](https://github.com/user-attachments/assets/d699d290-eb07-4122-a7d1-9f128436e275)

   - HOG
     
   ![image](https://github.com/user-attachments/assets/34fed824-098c-4305-ac61-4ca0293dbbdd)


3) ML Ensemble Models
   
   ![image](https://github.com/user-attachments/assets/f31d0a26-b2e9-4868-87e7-64a0c1d7db0f)

Comparison of Top 3 Individual Model and Best Ensemble Model - Accuracy Scores

![image](https://github.com/user-attachments/assets/bed1409c-c2de-4fd1-9fa5-0aa8ac51f00a)

4) Deep Learning Models

   ![image](https://github.com/user-attachments/assets/4f0fae25-ffeb-4c0b-a5a8-1d08667b72c7)

**Final: The testing accuracy of the CNN model with Reinforcement Learning is 84.77%. It is the highest as compared to the other Hybrid and Ensemble deep learning models. This is because in this CNN model with Reinforcement Learning, a policy-based reinforcement learning algorithm, REINFORCE was used to maximise the expected reward function which is the validation accuracy.**

--------------------------------------------------------------------------------------------------------------------------------

Framework:

![image](https://github.com/user-attachments/assets/10d13095-85f1-4711-b08d-3bd626f29598)

![image](https://github.com/user-attachments/assets/570c756a-0a45-41f8-91b4-c9ff50e5c4d1)

![image](https://github.com/user-attachments/assets/38b0f84b-1c8e-4812-bf97-f1eb1afa41ce)


