{{/*
This file contains helper template definitions.
*/}}

{{/* Full name */}}
{{- define "app.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{/*
metadata:
  name: {{ include "app.fullname" . }}
*/}}


{{/* Labels */}}
{{- define "app.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
metadata:
  labels:
    {{ include "app.labels" . | indent 4 }}
*/}}

{{/* Annotations */}}
{{- define "app.annotations" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}
{{/*
metadata:
  name: {{ include "app.fullname" . }}
  namespace: {{ .Release.Namespace }}
  annotations:
    {{ include "app.annotations" . | indent 4 }} 
*/}}

{{/* --- Conditions --- */}}
{{- define "app.isProduction" -}}
{{ eq .Values.env "production" }}
{{- end }}
{{/*
containers:
    - name: {{ .Chart.Name }}
        ...
        env:
        - name: ENV
            value: {{ .Values.env | quote }}
        {{- if include "app.isProduction" . }}
        - name: LOG_LEVEL
            value: "error"
        {{- else }}
        - name: LOG_LEVEL
            value: "debug"
        {{- end }}
*/}}

{{/* --- Service Account --- */}}
{{- define "app.serviceAccountName" -}}
{{- default (include "app.fullname" .) .Values.serviceAccount.name -}}
{{- end }}
{{/*
template:
    metadata:
      labels:
        app: {{ include "app.fullname" . }}
    spec:
      serviceAccountName: {{ include "app.serviceAccountName" . }}
*/}}

{{/* --- Required --- */}}
{{- define "app.image.repository" -}}
{{ required "You must specify an image.repository in values.yaml" .Values.image.repository }}
{{- end }}
{{/*
containers:
    - name: {{ .Chart.Name }}
        image: "{{ include "app.image.repository" . }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
*/}}