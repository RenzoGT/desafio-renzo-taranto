class CaixaDaLanchonete {
  
  calcularValorDaCompra(metodoDePagamento, itens) {
    
    // Tabela de descontos e taxas
    
    const metodosDePagamento = {
      dinheiro: {
        valor: 0.05,
        tipo: "desconto"
      },
      credito: {
        valor: 0.03,
        tipo: "taxa"
      },
      debito: {
        valor: 0,
        tipo: ""
      }
    };
    
    const tabelaPrecos = {
      cafe: {
        preco: 3,
        extra: {
          chantily: {
            preco: 1.5
          }
        }
      },
      suco: {
        preco: 6.2
      },
      sanduiche: {
        preco: 6.5,
        extra: {
          queijo: {
            preco: 2
          }
        }
      },
      salgado: {
        preco: 7.25
      },
      combo1: {
        preco: 9.5
      },
      combo2: {
        preco: 7.5
      }
    };
    
    let precoBruto = 0;
    
    // Verificação da existência do método de pagamento
    
    let metodoValido = false;
    
    for (let metodo in metodosDePagamento) {
      if (metodoDePagamento == metodo) {
        metodoValido = true;
      }
    }
    
    if (!metodoValido) return "Forma de pagamento inválida!";
    
    // Verificação da existência dos itens / quantidade dos itens
    
    if (itens.length == 0) return "Não há itens no carrinho de compra!"; 
    
    const codigos = ["cafe", "chantily", "suco", "sanduiche", "queijo", "salgado", "combo1", "combo2"];
    
    let codigoValido = false;
    
    let quantidadeValida = true;
    
    for (let codigo of codigos) {
      for (let item of itens) {
        if (item.includes(codigo)) {
          codigoValido = true;
        }
      }
    }
    
    if (!codigoValido) return "Item inválido!";
    
    for (let item of itens) {
      if (item.match(/(?<=\,).*/)[0] == 0) {
        quantidadeValida = false;
      }
    }
    
    if (!quantidadeValida) return "Quantidade inválida!";
    
    // Transformação do array de strings com os itens em um objeto, para que a análise dos dados seja facilitada
    
    const objetoDeItens = {};
    
    for (let item of itens) {
      let codigo = item.match(/.+?(?=,)/)[0];
      
      let qtd = item.match(/(?<=\,).*/)[0];
      
      objetoDeItens[codigo] = qtd;
    }
    
    // Verifica extras
    
    let extraTemPrincipal = true;
    
    const listaExtra = ["chantily", "queijo"];
    const extraPrincipais = ["cafe", "sanduiche"];
    
    for (let item in objetoDeItens) {
      for (let extra in listaExtra) {
        if (item == listaExtra[extra]) {
          if (!objetoDeItens.hasOwnProperty(extraPrincipais[extra])) {
            extraTemPrincipal = false;
          }
        }
      }
    }
    
    if (!extraTemPrincipal) return "Item extra não pode ser pedido sem o principal";

    // Faz as contas do preço bruto
    
    for (let item in objetoDeItens) {
      let codigoItem = item;
      let qtdItem = objetoDeItens[item];
      let precoItemQtd = 0;
      
      if (tabelaPrecos[codigoItem] == undefined) {
        for (let extra in listaExtra) {
          if (item == listaExtra[extra]) {
            let principal = tabelaPrecos[extraPrincipais[extra]];
            precoItemQtd = principal.extra[item].preco * qtdItem;
          }
        }
      } else {
        precoItemQtd = tabelaPrecos[codigoItem].preco * qtdItem;
      }
      
      precoBruto += precoItemQtd;
    }
    
    // Faz as contas do preço final, após descontos e taxas

    let precoFinal = 0;
    
    for (let metodo in metodosDePagamento) {
      if (metodoDePagamento == metodo) {
        if (metodosDePagamento[metodo].tipo == "desconto") {
          precoFinal = precoBruto - (precoBruto * metodosDePagamento[metodo].valor);
        } else if (metodosDePagamento[metodo].tipo == "taxa") {
          precoFinal = precoBruto + (precoBruto * metodosDePagamento[metodo].valor);
        } else if (metodosDePagamento[metodo].tipo == "") {
          precoFinal = precoBruto;
        }
      }
    }
    
    // Restringe o valor para dois números depois da vírgula e substitui o ponto pela virgula

    precoFinal = precoFinal.toFixed(2);
    
    precoFinal = precoFinal.replace(".", ",");
    
    return `R$ ${precoFinal}`;
  }
  
}

export { CaixaDaLanchonete };