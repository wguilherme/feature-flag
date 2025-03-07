<!-- main svc -->
kubectl port-forward svc/hello-world-service-operator 8080:80
<!-- health check -->
curl http://localhost:8080/health
<!-- feature flag -->
curl http://localhost:8080
<!-- application metrics -->
curl http://localhost:8080/metrics


<!-- patch feature flag -->
kubectl patch featureflag app-flags-operator --type=merge -p '{"spec":{"flagSpec":{"flags":{"welcome-message":{"defaultVariant":"v2"}}}}}'

<!-- flagD - métricas -->
kubectl port-forward $(kubectl get pod -l app=hello-world-operator -o name) 8014:8014

<!-- auditoria flagD -->
kubectl logs -l app=hello-world-operator -c flagd -f

<!-- observability -->
<!-- prmetheus -->
kubectl port-forward svc/prometheus 9090:9090

<!-- grafana -->
kubectl port-forward svc/grafana 3000:3000
admin/admin



<!-- métricas para teste -->

# Total de avaliações de feature flags
sum(feature_flag_flagd_impression_total)

# Avaliações por flag
sum(feature_flag_flagd_impression_total) by (feature_flag_key)

# Avaliações por variante
sum(feature_flag_flagd_impression_total) by (feature_flag_key, feature_flag_variant)

# Status do scrape
up{job="flagd-metrics"}



<!-- MISC -->
<!-- logs prometheus -->
kubectl logs deployment/prometheus