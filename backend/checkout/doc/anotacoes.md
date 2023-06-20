### Abstract Factory
Seu papel é criar famílias de objetos. No projeto estamos criando, por exemplo, famílias de Repositories. Por isso usamos o padrão para criar a interface RepositoryFactory.

Nesse caso obtemos duas vantagens:
- Fazemos com que os use cases só tenham que injetar 1 dependência no construtor;
- Se quisermos que os testes usem uma versão do banco em memória, é só criar um MemoryRepositoryFactory implementando o RepositoryFactory. Mudamos apenas uma linha praticamente.

