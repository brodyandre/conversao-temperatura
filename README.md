# Conversor de Temperatura 2.0

Aplicação web simples e containerizada para conversão de temperaturas entre Celsius, Fahrenheit e Kelvin.

O projeto foi desenvolvido como um MVP em Node.js com Express e EJS, com foco em simplicidade, boa apresentação visual e facilidade de execução em ambientes locais, containers Docker e Kubernetes.

## Visão Geral

O **Conversor de Temperatura 2.0** permite realizar conversões de temperatura por meio de uma interface web responsiva e também por uma API HTTP.

A aplicação exibe:

- nome da aplicação configurável por variável de ambiente;
- ambiente atual da execução;
- formulário de conversão;
- resultado da conversão;
- histórico em memória das últimas conversões;
- endpoint de saúde para uso em containers e Kubernetes.

## Funcionalidades

- Conversão entre Celsius, Fahrenheit e Kelvin.
- Interface web com EJS e CSS puro.
- Histórico em memória das últimas conversões.
- Endpoint `GET /health` para health check.
- Endpoint `GET /api/convert` para conversão via API.
- Leitura de variáveis de ambiente:
  - `APP_NAME`
  - `APP_ENV`
  - `PORT`
- Dockerfile pronto para build da imagem.
- Manifests Kubernetes com Deployment, Service e ConfigMap.
- Probes de readiness e liveness usando `/health`.

## Stack Utilizada

- **Node.js**
- **Express**
- **EJS**
- **HTML5**
- **CSS3**
- **Docker**
- **Kubernetes**

## Como Rodar Localmente

Entre na pasta da aplicação:

```bash
cd src
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:8080
```

Também é possível executar informando variáveis de ambiente:

```bash
APP_NAME="Conversor de Temperatura 2.0" APP_ENV=development PORT=8080 npm start
```

## Testes

Para executar os testes:

```bash
cd src
npm test
```

## Endpoints

### Health Check

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

### Conversão via API

```http
GET /api/convert?from=celsius&to=kelvin&value=25
```

Exemplo com `curl`:

```bash
curl "http://localhost:8080/api/convert?from=celsius&to=kelvin&value=25"
```

Unidades aceitas:

- `celsius`
- `fahrenheit`
- `kelvin`

## Como Buildar a Imagem Docker

O `Dockerfile` está dentro da pasta `src`, portanto o build deve ser executado a partir da raiz do repositório usando `./src` como contexto:

```bash
docker build -t conversao-temperatura:latest ./src
```

Para executar o container localmente:

```bash
docker run --rm -p 8080:8080 conversao-temperatura:latest
```

Acesse:

```text
http://localhost:8080
```

## Publicando a Imagem no Docker Hub

Antes de usar os manifests Kubernetes, substitua o placeholder da imagem no arquivo `k8s/deployment.yaml`:

```yaml
image: seu-usuario-dockerhub/conversao-temperatura:latest
```

Exemplo de build com tag para Docker Hub:

```bash
docker build -t seu-usuario-dockerhub/conversao-temperatura:latest ./src
```

Envie a imagem:

```bash
docker push seu-usuario-dockerhub/conversao-temperatura:latest
```

## Como Subir no Kubernetes

Os manifests ficam na pasta `k8s`:

- `configmap.yaml`
- `deployment.yaml`
- `service.yaml`

Aplicar todos os manifests:

```bash
kubectl apply -f k8s/
```

Verificar os recursos criados:

```bash
kubectl get all
```

Se estiver usando Minikube, acesse o serviço com:

```bash
minikube service conversao-temperatura
```

Também é possível acessar pelo NodePort configurado:

```text
http://NODE_IP:30000
```

## Comandos kubectl Principais

Listar pods:

```bash
kubectl get pods
```

Listar deployments:

```bash
kubectl get deployments
```

Listar services:

```bash
kubectl get services
```

Ver detalhes do deployment:

```bash
kubectl describe deployment conversao-temperatura
```

Ver logs da aplicação:

```bash
kubectl logs -l app=conversao-temperatura
```

Acompanhar rollout:

```bash
kubectl rollout status deployment/conversao-temperatura
```

Reiniciar o deployment:

```bash
kubectl rollout restart deployment/conversao-temperatura
```

Remover os recursos:

```bash
kubectl delete -f k8s/
```

## Estrutura de Pastas

```text
.
├── README.md
├── k8s
│   ├── configmap.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── src
    ├── Dockerfile
    ├── .dockerignore
    ├── convert.js
    ├── package.json
    ├── package-lock.json
    ├── public
    │   └── styles.css
    ├── server.js
    ├── test
    │   └── convert.js
    └── views
        └── index.ejs
```

## Variáveis de Ambiente

| Variável | Descrição | Valor padrão |
| --- | --- | --- |
| `APP_NAME` | Nome exibido na interface | `Conversor de Temperatura 2.0` |
| `APP_ENV` | Ambiente atual da aplicação | `development` |
| `PORT` | Porta HTTP usada pelo Express | `8080` |

No Kubernetes, essas variáveis são definidas pelo `ConfigMap` em `k8s/configmap.yaml`.

## Sugestões de Melhorias Futuras

- Adicionar testes de integração para os endpoints HTTP.
- Criar pipeline CI/CD para build, testes e publicação da imagem Docker.
- Adicionar Ingress para acesso por domínio.
- Incluir métricas com Prometheus.
- Persistir o histórico em banco de dados ou cache externo.
- Adicionar validação visual com testes end-to-end.
- Criar ambiente separado para desenvolvimento, homologação e produção.

## Status do Projeto

MVP funcional, com execução local, container Docker e manifests Kubernetes prontos para demonstração e evolução.
