# BDD Specs

## Narrativa 1

```
  Como Cliente online
Quero que o sistema mostre minhas compras
  Para eu poder controlar minhas despesas
```

### Cenários

```
  Dado que o cliente tem conexão com a internet
Quando o cliente solicitar para carregar suas compras
  Então o sistema deve exibir suas compras vindo de uma API
    E substituir os dados do cache com os dados atuais
```

## Narrativa 2

```
  Como um Cliente offline
Quero que o sistema me mostre minhas últimas compras gravadas
  Para eu poder ver minhas despesas mesmo sem internet
```

### Cenários

```
  Dado que o cliente não tem conexão com a internet
    E existe algum dado gravado no cache
    E os dados do cache forem mais novos do que 3 dias
Quando o cliente solicitar para carregar suas compras
  Então o sistema deve exibir suas compras vindas do cache

  Dado que o cliente não tem conexão com a internet
    E existe algum dado gravado no cache
    E os dados do cache forem mais velhos ou iguais a 3 dias
Quando o cliente solicitar para carregar suas compras
  Então o sistema deve exibir uma mensagem de erro

  Dado que o cliente não tem conexão com a internet
    E o cache esteja vazio
Quando o cliente solicitar para carregar suas compras
  Então o sistema deve exibir uma mensagem de erro

```
