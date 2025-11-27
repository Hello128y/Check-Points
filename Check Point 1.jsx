import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const DADOS_DASHBOARD = {
  comandante: "Comandante Xaden",
  destino: {
    nome: "Planeta Marte",
    temperatura: "-28°C ❄️",
    gravidade: "1.2 G (Alta)",
    descricao:
      "Exoplaneta na zona habitável. Missão principal: coleta de bioamostras.",
    clima: "Temperatura Elevada",
  },
  missao: {
    status: "Em Trânsito Estável",
    progresso: 78,
  },
  climaEspacial: [
    {
      nome: "Ventos ",
      valor: "Leves (300 km/s)",
      simbolo: "💨",
      condicao: "bom",
    },
    {
      nome: "Umidade",
      valor: "120% (Alta)",
      simbolo: "🌡️",
      condicao: "Ruim",
    },
     {
      nome: "Radiação Cósmica",
      valor: "0.12 mSv/h (Baixo)",
      simbolo: "☢️",
      condicao: "baixo",
    },
  ],
  relatorio: [
    { id: 1, evento: "Decolagem da Órbita de Apoio.", data: "01/05/2025" },
    {
      id: 2,
      evento: "Calibração dos Sistemas de Propulsão.",
      data: "05/05/2025",
    },
    {
      id: 3,
      evento: "Correção de Curso: desvio de 0.002 AU.",
      data: "10/05/2025",
    },
    {
      id: 4,
      evento: "Ativação do Escudo de Plasma Anti-meteoroide.",
      data: "15/05/2025",
    },
  ],
};

function formatarDataGalactica(nomePlaneta) {
  const agora = new Date();
  const tempoGalactico = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dataGalactica = agora.toLocaleDateString("pt-BR");
  return `Destino: ${nomePlaneta} | Via Láctea- ${dataGalactica} | Horário: ${tempoGalactico}`;
}

function CardInformacao({ nome, valor, progresso, simbolo, condicao = "" }) {
  const estiloBarra = { width: `${progresso}%` };

  let condicaoClass = "";
  if (condicao === "bom") condicaoClass = "condicao-success";
  if (condicao === "medio") condicaoClass = "condicao-warning";
  if (condicao === "baixo") condicaoClass = "condicao-safe";

  return (
    <div className={`card-info ${condicaoClass}`}>
      <div className="card-header">
        {simbolo && <span className="card-simbolo">{simbolo}</span>}
        <h2>{nome}</h2>
      </div>

      {valor && <p className="card-valor">{valor}</p>}

      {progresso !== undefined && (
        <div className="barra-progresso-container">
          <div className="barra-progresso" style={estiloBarra}>
            {progresso}% Percorrido
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardEspacial() {
  const { comandante, destino, missao, climaEspacial, relatorio } =
    DADOS_DASHBOARD;

  let StatusClimaDestino;
  let ClimaCor;
  if (destino.clima === "ensolarado") {
    StatusClimaDestino = "Estável";
    ClimaCor = "success";
  } else if (destino.clima === "chuvoso") {
    StatusClimaDestino = "Alerta";
    ClimaCor = "danger";
  } else {
    StatusClimaDestino = "Frio/Nublado";
    ClimaCor = "safe";
  }

  return (
    <div className="dashboard-espacial">
      <header className="dashboard-header">
        <h1 className="saudacao">Saudações, {comandante}</h1>
        <p className="data-galactica">
          ⌚ {formatarDataGalactica(destino.nome)}
        </p>
      </header>

      <main className="main-content">
        <div className="grade-principal">
          <section className="secao-status">
            <h2 className="secao-titulo">Status da Missão</h2>
            <CardInformacao
              nome={`Status: ${missao.status}`}
              progresso={missao.progresso}
              simbolo=">"
              condicao={missao.progresso > 75 ? "bom" : "medio"}
            />
          </section>

          <div className="grade-secundaria">
            <section className="secao-planeta">
              <h2 className="secao-titulo">
                Detalhes do Destino: {destino.nome}
              </h2>
              <div className={`card-planeta condicao-${ClimaCor}`}>
                <p className="clima-simbolo status-clima">
                  Clima: {StatusClimaDestino}
                </p>
                <p>Temperatura: {destino.temperatura} </p>
                <p>Gravidade: {destino.gravidade} </p>
                <p className="planeta-descricao">
                  Descrição: {destino.descricao}
                </p>
              </div>
            </section>
            <section className="secao-clima">
              <h2 className="secao-titulo">Previsão do Tempo Espacial</h2>
              <div className="grade-clima">
                {climaEspacial.map((dado, index) => (
                  <CardInformacao
                    key={index}
                    nome={dado.nome}
                    valor={dado.valor}
                    simbolo={dado.simbolo}
                    condicao={dado.condicao}
                  />
                ))}
              </div>
            </section>
          </div>
          <section className="secao-relatorio">
            <h2 className="secao-titulo">Relatório de Bordo</h2>
            <ol className="lista-relatorio">
              {relatorio.map((item) => (
                <li key={item.id}>
                  [{item.data}] - {item.evento}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}
