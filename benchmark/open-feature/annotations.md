kubectl port-forward svc/hello-world-service-operator 8080:80
curl http://localhost:8080

curl http://localhost:8080/health

curl http://localhost:8080/metrics


<!-- patch inline com kubectl -->

# Patch usando merge estratégico
kubectl patch featureflag app-flags-operator --type=merge -p '{"spec":{"flagSpec":{"flags":{"welcome-message":{"defaultVariant":"v1"}}}}}'


<!-- visualizar métricas do flagd -->
kubectl port-forward $(kubectl get pod -l app=hello-world-operator -o name) 8014:8014


<!-- visualizar logs -->
<!-- mostra os logs de mutação das flags -->
kubectl logs -l app=hello-world-operator -c flagd -f


kubectl port-forward svc/prometheus 9090:9090

kubectl port-forward svc/grafana 3000:3000
admin/admin



<!-- métricas -->

# Total de avaliações de feature flags
sum(feature_flag_flagd_impression_total)

# Avaliações por flag
sum(feature_flag_flagd_impression_total) by (feature_flag_key)

# Avaliações por variante
sum(feature_flag_flagd_impression_total) by (feature_flag_key, feature_flag_variant)

# Status do scrape
up{job="flagd-metrics"}

<!-- logs prometheus -->
kubectl logs deployment/prometheus