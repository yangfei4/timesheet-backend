import numpy as np
from matplotlib import pyplot as plt

plot = "Q1b"

if plot=="Q1b":
    data1 = np.array([1,3])
    data2 = np.array([4,7])
    plt.scatter(data1[0], data1[1], label = "point1")
    plt.scatter(data2[0], data2[1], label = "point2")
    # plt.plot(np.array([0,1]))
    plt.legend()
    plt.xlim([0,6])
    plt.ylim([0,10])
    # plt.show()

    # X = np.array([[-2**0.5/2,-2**0.5/2],[2**0.5/2,2**0.5/2]]).T
    X = np.array([[1.,3.],[4.,7.]])
    rows, cols = X.shape
    X_norm = np.empty(X.shape)
    for i in range(rows):
        mean = np.mean(X[:, i])
        std = np.std(X[:, i])
        X_norm[:,i] = (X[:,i]-mean)/std

    # print(X.mean())
    # X_norm = (X.T-X.mean(axis=1))/X.std(axis=1).T
    print(X_norm.T)
    # print(np.cov(X_norm.T))
    # Sigma = np.dot(X_norm, X_norm.T)
    Sigma = np.dot(X_norm, X_norm.T)
    print(Sigma)
    eigenvalues, eigenvectors = np.linalg.eig(Sigma)
    print(eigenvalues)
    print(eigenvectors)

elif plot=="Q1c":
    data = np.array([[2,0],[2,2],[6,0],[6,2]])
    for i in range(len(data)):
        plt.scatter(data[i][0], data[i][1], label = "point"+str(i))
    plt.legend()
    plt.xlim([0,8])
    plt.ylim([-2,4])
    plt.show()