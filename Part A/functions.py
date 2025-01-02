import time
import pandas as pd
import numpy as np
from keras.datasets import cifar10
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, MaxPool2D, Flatten, Dropout, BatchNormalization
from sklearn.model_selection import cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay, roc_curve, auc
from sklearn import preprocessing
import matplotlib.pyplot as plt

def cnn(input_shape):
    cnn = Sequential()

    # Convolutional Layer
    cnn.add(Conv2D(filters=32, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    cnn.add(Conv2D(filters=32, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    # Pooling layer
    cnn.add(MaxPool2D(pool_size=(2, 2)))
    # Dropout layers
    cnn.add(Dropout(0.25))

    cnn.add(Conv2D(filters=64, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    cnn.add(Conv2D(filters=64, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    cnn.add(MaxPool2D(pool_size=(2, 2)))
    cnn.add(Dropout(0.25))

    cnn.add(Conv2D(filters=128, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    cnn.add(Conv2D(filters=128, kernel_size=(3, 3), input_shape=input_shape, activation='relu', padding='same'))
    cnn.add(BatchNormalization())
    cnn.add(MaxPool2D(pool_size=(2, 2)))
    cnn.add(Dropout(0.25))

    cnn.add(Flatten())
    cnn.add(Dense(128, activation='relu'))
    cnn.add(Dropout(0.25))
    cnn.add(Dense(10, activation='softmax'))
    
    return cnn

def ann(input_shape):
    ann = Sequential()
    
    ann.add(Flatten(input_shape=input_shape))
    ann.add(Dense(512, activation='relu'))
    ann.add(Dense(256, activation='relu'))
    ann.add(Dense(64, activation='relu'))
    ann.add(Dense(32, activation='relu'))
    ann.add(Dense(10, activation='softmax'))
    
    return ann

def load_data(data_train=None, data_test=None, train_test=1, scale=1, flatten=1):
    if data_train == None:
        (X_train, y_train), (X_test, y_test) = cifar10.load_data()
        y_train = y_train.flatten()
        y_test = y_test.flatten()
        
        if flatten == 1:
            X_train = X_train.reshape(-1, 32 * 32 * 3)
            X_test = X_test.reshape(-1, 32 * 32 * 3)
        
        if scale == 1:
            X_train = X_train / 255
            X_test = X_test / 255
    else:
        df_train = pd.read_csv(data_train)
        X_train = df_train.iloc[:, :len(df_train.columns) - 1].values
        y_train = df_train["label"].values
        
        if train_test == 1:
            if data_test == None:
                (x, y), (X_test, y_test) = cifar10.load_data()
                X_test = X_test / 255
                y_test = y_test.flatten()
                
                if flatten == 1:
                    X_test = X_test.reshape(-1, 32 * 32 * 3)
            else:
                df_test = pd.read_csv(data_test)
                X_test = df_test.iloc[:, :len(df_test.columns) - 1].values
                y_test = df_test["label"].values 
        
        if flatten == 0:
            if data_train == '../Data/train_aug_hog_cnn.csv' or data_train == '../Data/train_hog_cnn.csv':
                X_train = X_train.reshape(-1, 32, 32)
                X_test = X_test.reshape(-1, 32, 32)
            else:
                X_train = X_train.reshape(-1, 32, 32, 3)
                
                if X_test[0].shape != (32, 32, 3):
                    X_test = X_test.reshape(-1, 32, 32, 3)
        
    if train_test == 0:
        return (X_train, y_train)
        
    return (X_train, X_test, y_train, y_test)

def auc_roc(X, y, clf, clf_name, classes):
    fpr = {}
    tpr = {}
    thresh = {}  
    roc_auc = {}
    
    y_unique = np.unique(y)
    y_predict_binarized = preprocessing.label_binarize(y, classes=y_unique)
    
    if clf_name == None:
        predict_prob = clf.predict_proba(X)
    else:
        predict_prob = clf.predict(X, verbose=0)
        
    plt.rcParams['figure.figsize'] = (10, 8)
    
    # Ranking Prediction - ROC and AUC
    for i in range(len(y_unique)):
        # Draw ROC curve
        fpr[i], tpr[i], thresh[i] = roc_curve(y_predict_binarized[:, i], predict_prob[:, i])

        # Area under the curve (AUC)
        roc_auc[i] = auc(fpr[i], tpr[i])
        plt.plot(fpr[i], tpr[i], linestyle = '--', label = f'{classes[y_unique[i]]} Vs Rest (AUC {roc_auc[i]:.2f})')

    # Diagonal line
    plt.plot([0, 1], [0, 1], 'b--')
    
    # Set x and y range from 0 to 1
    plt.ylim([0, 1])
    plt.xlim([0, 1])
    plt.title('Multiclass ROC curve')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend(loc='lower right')
    plt.show()
    
def model_evaluation(clf, y_train, train_predict, X_test, y_test, test_predict, training_time, clf_name=None):
    classes = ['Airplane', 'Automobile', 'Bird', 'Cat', 'Deer', 'Dog', 'Frog', 'Horse', 'Ship', 'Truck']
    
    # model evaluation
    print(f'Accuracy Score: ')
    print('============================')
    print(f'Train Accuracy Score  : {accuracy_score(y_train, train_predict) * 100: .4f}%')
    print(f'Test Accuracy Score   : {accuracy_score(y_test, test_predict) * 100: .4f}%')
    print(f'Training Time         : {training_time: .4f}')
    
    print(f'\nClassification Report: ')
    print('============================')
    print(classification_report(y_test, test_predict, target_names=classes))
    
    print(f'\nConfusion Matrix: ')
    print('============================')
    cm = confusion_matrix(y_test, test_predict)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=classes)
    fig, ax = plt.subplots(figsize=(15, 15))
    
    if clf_name == None:
        ax.set_title(clf.__class__.__name__)
    else:
        ax.set_title(clf_name)
        
    disp.plot(ax=ax)
    plt.show()

    auc_roc(X_test, test_predict, clf, clf_name, classes)  
    
    print(f'\nPredicted and Actual Test Set Results: ')
    print('========================================')
    first_10_actual = [classes[y_test[i]] for i in range(10)]
    first_10_pred = [classes[test_predict[i]] for i in range(10)]
    print(f'Actual Results:', first_10_actual)
    print(f'Predicted Results:', first_10_pred)
    print()
    
def train_predict_ml(clf, data_train=None, data_test=None, scale=1):
    # load data
    X_train, X_test, y_train, y_test = load_data(data_train, data_test, train_test=1, scale=scale)
    
    # model training
    start_time = time.time()
    clf.fit(X_train, y_train)
    end_time = time.time()
    training_time = end_time - start_time
    
    # model prediction 
    train_predict = clf.predict(X_train)
    test_predict = clf.predict(X_test) 
    
    # model evaluation
    model_evaluation(clf, y_train, train_predict, X_test, y_test, test_predict, training_time)

def train_predict_nn(clf, clf_name, epochs, batch_size=32, data_train=None, data_test=None, scale=1, flatten=1):
    # load data
    X_train, X_test, y_train, y_test = load_data(data_train, data_test, train_test=1, scale=scale, flatten=flatten)
    
    # model training
    start_time = time.time()
    history = clf.fit(X_train, y_train, batch_size=batch_size, epochs=epochs, validation_split=0.3, verbose=1)
    end_time = time.time()
    training_time = end_time - start_time
    
    # plot accuracy and loss graphs
    epochs_list = range(1, epochs + 1)
    
    # plot accuracy and loss graphs
    plt.figure(figsize=(15, 5))
    
    # train and validation accuracy graph
    plt.subplot(1, 2, 1)
    plt.plot(epochs_list, history.history['accuracy'], label='Train Accuracy')
    plt.plot(epochs_list, history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.grid()
    plt.legend()
    
    # train and validation loss graph
    plt.subplot(1, 2, 2)
    plt.plot(epochs_list, history.history['loss'], label='Train Loss')
    plt.plot(epochs_list, history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.grid()
    plt.legend()
    plt.show()
    
    # model prediction 
    train_predict = clf.predict(X_train, verbose=0)
    test_predict = clf.predict(X_test, verbose=0)
        
    train_predict_transform = [np.argmax(pred) for pred in train_predict]
    test_predict_transform = [np.argmax(pred) for pred in test_predict]
    
    # model evaluation
    model_evaluation(clf, y_train, train_predict_transform, X_test, y_test, test_predict_transform, training_time, clf_name)

def cross_validation(clf, data_train=None, scale=1):
    # load data
    X, y = load_data(data_train, train_test=0, scale=scale)
        
    # perform cross validation
    start_time = time.time()
    scores = cross_val_score(clf, X, y, cv=5)
    end_time = time.time()
    
    print("Model Accuracies:")
    print("Individual Accuracy:", scores)
    print("Mean:", scores.mean())
    print("Standard Deviation:", scores.std())
    print("Training Time:", end_time - start_time)
    
    # model evaluation
    plt.plot(list(range(1, 6)), scores, label='Accuracy per Fold')
    plt.title("Model Accuracy")
    plt.xlabel("Model Run")
    plt.ylabel("Prediction Accuracy")
    
    average = [scores.mean()] * 5
    plt.plot(list(range(1, 6)), average, color='red', linewidth=1.0, linestyle='--', label='Average')
    plt.legend()
    plt.show()