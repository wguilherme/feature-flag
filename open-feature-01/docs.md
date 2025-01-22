Como visualizar a métrica de uso das flags do flagd.

kubectl port-forward svc/flagd 8014:8014
curl http://localhost:8014/metrics



feature_flag_flagd_evaluation_reason_total
feature_flag_flagd_impression_total




open-feature, official documentation:

quickstart:

kind create cluster --config kind-cluster-quick-start.yaml



url: https://openfeature.dev/docs/tutorials/open-feature-operator/quick-start


steps:


kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml && \
kubectl wait --timeout=60s --for condition=Available=True deploy --all -n 'cert-manager'
helm repo add openfeature https://open-feature.github.io/open-feature-operator/ && \
helm repo update && \
helm upgrade --install open-feature-operator openfeature/open-feature-operator

// download assets
curl -sfL https://raw.githubusercontent.com/open-feature/playground/main/config/k8s/end-to-end.yaml > end-to-end.yaml

// deploy workload
kubectl -n default apply -f end-to-end.yaml && \
kubectl wait --timeout=60s deployment --for condition=Available=True -l 'app=open-feature-demo' -n 'default'


// observability

custom resources
kubectl get featureflags
kubectl get featureflagsources


// troubleshooting
// deployment logs
kubectl logs deployment/open-feature-demo-deployment

// logs open-feature operator system controller manager
kubectl logs -n open-feature-operator-system deployment/open-feature-operator-controller-manager





kubectl port-forward svc/hello-world-service-operator 3001:80
kubectl port-forward svc/hello-world-service 3000:80

http://localhost:3000 - standalone
http://localhost:3001 - operator