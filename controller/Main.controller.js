sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("jogodavelha.controller.Main", {
            onInit: function () {
                this.vez = 'x_image'; // this referencia a si próprio (ME -> no ABAP)
                //Matrix de possibilidades de vitória
                this.vitorias_possiveis = [
                    [1,2,3],
                    [4,5,6],
                    [7,8,9],
                    [1,5,9],
                    [3,5,7],
                    [1,4,7],
                    [2,5,8],
                    [3,6,9],
                ];
            },
            onClickCasa: function (evento) {
                //obter referencia do objeto que foi clicado
                let casa = evento.getSource();

                //verifica se imagem selecionada é a em branco.
                let imagem = casa.getSrc();
                
                if (imagem == "../img/blank.png") {
                    casa.setSrc("../img/" + this.vez + ".png");

                    //Lógica para verificar ganhador do jogo
                    // desvio condicional
                    if (this.temVencedor() == true) {
                        //alert(this.vez + ' ganhou!');
                        
                        MessageBox.success(this.vez + ' ganhou!');

                        new Promise((resolve) => {
                            setTimeout(() => {
                              resolve(this.resetarGameAposVencedor());
                            }, 1500);
                        });
                        return;
                    }

                    if (this.vez == "x_image") {
                        this.vez = "bola";
                        //chamar função de jogada do computador
                        this.jogadaComputador();
                    }
                    else {
                        this.vez = "x_image";
                    }
                }
            },
            temVencedor: function () {
                if (this.casasIguais(1, 2, 3) || this.casasIguais(4, 5, 6) || this.casasIguais(7, 8, 9)
                    || this.casasIguais(1, 4, 7) || this.casasIguais(2, 5, 8) || this.casasIguais(3, 6, 9)
                    || this.casasIguais(1, 5, 9) || this.casasIguais(3, 5, 7)) {
                    return true;
                };
            },
            casasIguais: function (a, b, c) {
                // obtenho objetos da tela
                let casaA = this.byId("casa" + a); // byId -> Pega o Id da Tag Image no edmx view.xml
                let casaB = this.byId("casa" + b);
                let casaC = this.byId("casa" + c);

                //obtenho imagens da tela
                let imgA = casaA.getSrc();
                let imgB = casaB.getSrc();
                let imgC = casaC.getSrc();

                //verificação se imagens são iguais
                //desvio condicional = IF
                if (imgA == imgB && imgB == imgC && imgA != "../img/blank.png") {
                    return true;
                }
            },
            resetarGameAposVencedor: function() {
                
                let casa1 = this.byId("casa1");
                let casa2 = this.byId("casa2");
                let casa3 = this.byId("casa3");
                let casa4 = this.byId("casa4");
                let casa5 = this.byId("casa5");
                let casa6 = this.byId("casa6");
                let casa7 = this.byId("casa7");
                let casa8 = this.byId("casa8");
                let casa9 = this.byId("casa9");

                casa1.setSrc('../img/blank.png');
                casa2.setSrc('../img/blank.png');
                casa3.setSrc('../img/blank.png');
                casa4.setSrc('../img/blank.png');
                casa5.setSrc('../img/blank.png');
                casa6.setSrc('../img/blank.png');
                casa7.setSrc('../img/blank.png');
                casa8.setSrc('../img/blank.png');
                casa9.setSrc('../img/blank.png');

                this.vez = "x_image";
            },
            jogadaComputador: function() {
                //definir parametros iniciais (pontuação)
                //lista de pontos para jogadores
                let listaPontosX = [];
                let listaPontosO = [];

                // lista de jogadas possíveis
                let jogadaInicial = []; //inicio do jogo
                let jogadaVitoria = []; // vitória é certa
                let jogadaRisco = []; // risco de perder
                let tentativa_vitoria = []; // aumenta chance de vitória
                
                //Calculo da pontuação de cada possibilidade de vitória

                //loop em cada possibilidade vitória
                this.vitorias_possiveis.forEach((combinacao) => {
                    // zera pontos iniciais
                    let pontosX = 0;
                    let pontosO = 0;
                    //debugger
                    
                    //Dentro das vitórias possíveis, fazer um loop para verificar cada casa daquela combinação!
                    combinacao.forEach((posicao) => {
                        let casa = this.byId(`casa${posicao}`);
                        let img = casa.getSrc();

                        //Dar a pontuação de acordo com quem venceu o jogo!
                        if(img == "../img/x_image.png") {
                            pontosX++;
                        }
                    
                        if(img == "../img/bola.png"){
                            pontosO++;
                        }
                    });
                
                    //atribui ponto para combinação de possíveis vitórias
                    listaPontosX.push(pontosX);
                    listaPontosO.push(pontosO);
                });

                //jogar com base nam maior pontuação (ou maior prioridade para não perder)
                //para cada possibilidade de vitória do joghador O, ver quantos pontos X tem na mesma combinação.
                //loop na lista de pontos do O.

                listaPontosO.forEach((posicao, index) => {
                    //Ver quantos pontos o jogador O tem.
                    switch (posicao){
                        case 0: //menor pontuacao
                            //ver se X tem 2 pontos, porque é onde estou perdendo
                            if(listaPontosX[index] == 2) 
                            {
                                jogadaRisco.push(this.vitorias_possiveis[index]);
                            }
                            else if(listaPontosX[index] == 1)
                            {
                                jogadaInicial.push(this.vitorias_possiveis[index]);
                            }
                        break;
                        case 1: // Jogada neutra
                            if(listaPontosX[index] == 1)
                            {
                                jogadaInicial.push(this.vitorias_possiveis[index]);
                            }
                            else if(listaPontosX[index] == 0)
                            {
                                tentativa_vitoria.push(this.vitorias_possiveis[index]);
                            }
                        break;
                        case 2: // vitória mais certa
                            if(listaPontosX[index] == 0)
                            {
                                jogadaVitoria.push(this.vitorias_possiveis[index]);
                            }
                        break;
                    }
                });
                //debugger;

                //jogar na combinação de maior prioridade
                if(jogadaVitoria.length > 0)
                {
                    //jogar nas combinações de vitória
                    this.jogadaIA(jogadaVitoria);
                }
                else if(jogadaRisco.length > 0)
                {
                    //jogar aonde posso perder
                    this.jogadaIA(jogadaRisco);
                } 
                else if(tentativa_vitoria.length > 0)
                {
                    //jogar aonde posso tentar ganhar
                    this.jogadaIA(tentativa_vitoria);
                }
                else if(jogadaInicial.length > 0)
                {
                    //jogada neutra
                    this.jogadaIA(jogadaInicial);
                }
            },
            jogadaIA: function(dados) {
                //separar números das casas que posso jogar
                let numeros = [];

                //verificar se casa possível de ser jogada está vazia
                //loop nas combinações para ver se casa está vazia
                dados.forEach((combinacao) => {
                    //verificar cada casa individualmente
                    //outro loop
                    combinacao.forEach((num) => {
                        //verificar se casa está vazia
                        let casa = this.byId(`casa${num}`);
                        let img = casa.getSrc();
                        if(img == '../img/blank.png'){
                            numeros.push(num);
                        }
                    });
                });

                //jogada aleatória nos valores possíveis
                this.jogadaAleatoriaIA(numeros);
            },
            jogadaAleatoriaIA: function(numeros) {
                //math random gera numero aleatorio entre 0 e 1
                //Math.floor pega apenas a parte inteira do numero
                let numeroAleatorio = Math.random() * numeros.length;
                let numeroInteiro = Math.floor(numeroAleatorio);

                let jogada = numeros[numeroInteiro];
                let casa = this.byId(`casa${jogada}`);
                casa.setSrc("../img/bola.png");

                if (this.temVencedor() == true) {
                    MessageBox.success(this.vez + ' ganhou!');

                    //this.resetarGameAposVencedor();
                    new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(this.resetarGameAposVencedor());
                        }, 1500);
                    });
                    return;
                }
                else
                {
                    this.vez = "x_image";
                }

            },
        });
    });
