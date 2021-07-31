{{- define "brickdoc.deploymentCommon" }}
          image: {{ .Values.image.name | quote }}
          {{- if .Values.previewEnv }}
          imagePullPolicy: Always
          {{- end }}
          {{- if empty .Values.secrets  }}
          {{- else }}
          envFrom:
          - secretRef:
              name: {{ include "brickdoc.fullname" . }}
          {{- end }}    
          env:
            {{- range $key, $value := .Values.envs }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
            {{- if .Values.previewEnv }}
            - name: REDIS_URL
              value: redis://{{ include "brickdoc.devDependenciesService" . }}:6379
            - name: BRICKDOC_DATABASE_URL
              value: postgresql://postgres:NonPersistenceInstance@{{ include "brickdoc.devDependenciesService" . }}/brickdoc_cicd  
            {{- end }}
{{- end }}