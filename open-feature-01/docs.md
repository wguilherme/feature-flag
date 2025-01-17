Como visualizar a métrica de uso das flags do flagd.

kubectl port-forward svc/flagd 8014:8014
curl http://localhost:8014/metrics



feature_flag_flagd_evaluation_reason_total
feature_flag_flagd_impression_total