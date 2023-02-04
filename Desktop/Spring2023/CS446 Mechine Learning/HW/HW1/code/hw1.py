import torch
import hw1_utils


def k_means(X=None, init_c=None, n_iters=50):
    """K-Means.

    Argument:
        X: 2D data points, shape [2, N].
        init_c: initial centroids, shape [2, 2]. Each column is a centroid.
    
    Return:
        c: shape [2, 2]. Each column is a centroid.
    """

    if X is None:
        X, init_c = hw1_utils.load_data()
    c1, x1 = init_c[:,:1], X[:,:10]
    c2, x2 = init_c[:,1:], X[:,10:]
    
    cluster_lables = []
    uk = [[c1,c2]]
    
    costs = []
    for iter in range(n_iters):
        print(f"Iteration {iter}")
        distances = torch.sum((X.unsqueeze(1)-init_c.unsqueeze(2))**2, dim=0)
        cluster_lables = torch.argmin(distances, dim=0)
        print("clusters = ", cluster_lables)

        cur_uk = []
        cost = 0
        for i in range(2):
            N = list(cluster_lables).count(i)
            u = torch.zeros(1,2)
            for index in range(20):
                if cluster_lables[index]==i:
                    cost += distances[i][index]*0.5
                    u += X[:, index]
            u = u/N
            cur_uk.append(u.reshape(2,1))

        costs.append(cost)
        init_c = torch.cat((cur_uk[0], cur_uk[1]), dim=1)  
        if cur_uk[0].tolist() == uk[-1][0].tolist() and cur_uk[1].tolist() == uk[-1][1].tolist():
            break

        uk.append(cur_uk)
    print("uk = ", uk)
    print("cost = ", costs)

    return torch.cat((uk[-1][0], uk[-1][1]), dim=1)