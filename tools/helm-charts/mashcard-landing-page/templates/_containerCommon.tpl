{{- define "mashcard-landing-page.deploymentCommon" }}
          image: {{ .Values.image.name | quote }}
          {{- if empty .Values.secrets  }}
          {{- else }}
          envFrom:
          - secretRef:
              name: {{ include "mashcard-landing-page.fullname" . }}
          {{- end }}
          env:
            {{- range $key, $value := .Values.envs }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
{{- end }}
