import React, { useState, useEffect } from "react";
import LandingLogin from "./LandingLogin";
import Onboarding from "./Onboarding";
import { getSystemPrompt } from "./knowledgeBase";
import AnamneseEspecialidade from "./AnamneseEspecialidade";
import { supabase } from "./auth";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-6";
const MEMED_API_KEY = "iJGiB4kjDGOLeDFPWMG3no9VnN7Abpqe3w1jEFm6olkhkZD6oSfSmYCm";
const MEMED_SECRET_KEY = "Xe8M5GvBGCr4FStKfxXKisRo3SfYKI7KrTMkJpCAstzu2yXVN4av5nmL";
const MEMED_URL = "https://integrations.api.memed.com.br";

const SUPABASE_URL = "https://qagigcnqjqiyafcbjend.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZ2lnY25xanFpeWFmY2JqZW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTczOTUsImV4cCI6MjA5NDI3MzM5NX0.arDHzDFKN5RNY0wcXakqHNpLCfnjuCn-al9Le-GBRY0";

const fixNewlines = (str) => (str || "").replace(/\\n/g, '\n');

async function salvarConsulta(dados) {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/CONSULTAS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(dados)
    });
    return res.ok;
  } catch(e) {
    console.error("Erro ao salvar:", e);
    return false;
  }
}

async function buscarConsultas() {
  try {
    const res = await fetch(SUPABASE_URL + "/rest/v1/CONSULTAS?order=data_consulta.desc", {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      }
    });
    return await res.json();
  } catch(e) {
    return [];
  }
}

const MEDS_CONTROLADOS = [
  "escitalopram","lexapro","sertralina","zoloft","fluoxetina","prozac","daforin",
  "paroxetina","paxil","aropax","fluvoxamina","luvox","citalopram","cipramil",
  "venlafaxina","effexor","efexor","duloxetina","cymbalta","desvenlafaxina","pristiq",
  "amitriptilina","amytril","nortriptilina","pamelor","clomipramina","anafranil",
  "imipramina","tofranil","quetiapina","seroquel","risperidona","risperdal",
  "olanzapina","zyprexa","aripiprazol","abilify","haloperidol","haldol",
  "clozapina","clozaril","ziprasidona","geodon","paliperidona","invega",
  "lítio","lithium","carbolitium","valproato","depakote","epilim",
  "lamotrigina","lamictal","carbamazepina","tegretol","oxcarbazepina","trileptal",
  "bupropiona","wellbutrin","zyban","mirtazapina","remeron","trazodona","desyrel",
  "vilazodona","viibryd","vortioxetina","trintellix","brintellix",
  "clonazepam","rivotril","alprazolam","frontal","xanax",
  "diazepam","valium","lorazepam","lorax","bromazepam","lexotan",
  "zolpidem","stilnox","metilfenidato","ritalina","concerta",
  "lisdexanfetamina","vyvanse","modafinila","stavigile"
];

const ehControlado = (nome) => MEDS_CONTROLADOS.some(m => nome.toLowerCase().includes(m));

const EXAMES_LISTA = {
  HEMATOLOGIA: ["Hemograma","VHS","Fibrinogênio","Grupo Sanguíneo + RH","Coombs Indireto","Coagulograma (TP e TTPA)"],
  BIOQUÍMICA: ["Glicose","Hemoglobina Glicada","Insulina","Uréia","Creatinina","Sódio","Potássio","Cálcio","Magnésio","Zinco","Colesterol Total","HDL","LDL","Triglicerídeos","TGO","TGP","Bilirrubina Total e Frações","Gama GT","Fosfatase Alcalina","Ácido Úrico","CPK","Proteínas Totais e Frações","Ácido Fólico","Ferritina","Ferro","Saturação de Transferrina","Vitamina D (25 OHD)","Vitamina B12","LDH"],
  HORMÔNIO: ["TSH","T4 Livre","T3","Prolactina","Cortisol","PSA Total","PSA Livre","Estradiol","FSH","LH","Testosterona Total","Testosterona Livre","Progesterona"],
  IMUNOLOGIA: ["PCR","VDRL","HIV I E II","HBsAG","Anti-HBs","Anti-HCV","Anti-HAV IgM e IgG","FAN","Fator Reumatóide","Anti-Tireoglobulina","Anti-TPO","TRAb","BHCG Quantitativo"],
  "URINA E MICROBIOLOGIA": ["EAS","Urocultura","Antibiograma","Cultura de Orofaringe"],
};

const hoje = () => new Date().toLocaleDateString("pt-BR", {day:"2-digit",month:"long",year:"numeric"});
const hojeSlash = () => new Date().toLocaleDateString("pt-BR");

async function abrirMemed(medicamentos, nomePaciente) {
  try {
    const authRes = await fetch(`${MEMED_URL}/v1/sinapse-prescricao/usuario/token?api-key=${MEMED_API_KEY}&secret-key=${MEMED_SECRET_KEY}`, {
      method: "GET", headers: {"Accept":"application/json","Content-Type":"application/json"}
    });
    const authData = await authRes.json();
    const token = authData?.data?.attributes?.token;
    if (!token) { alert("Erro ao autenticar no Memed."); return; }
    const prescricao = {
      data: { type:"prescricoes", attributes: {
        "paciente-nome": nomePaciente || "Paciente",
        medicamentos: medicamentos.map(m => ({"nome":m.medicamento,"posologia":m.posologia,"quantidade":1}))
      }}
    };
    const prescRes = await fetch(`${MEMED_URL}/v1/sinapse-prescricao/prescricoes`, {
      method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":`Bearer ${token}`},
      body: JSON.stringify(prescricao)
    });
    const prescData = await prescRes.json();
    const prescId = prescData?.data?.id;
    if (prescId) window.open(`https://memed.com.br/prescricao/${prescId}`, "_blank");
    else alert("Prescrição criada! Abra o Memed para assinar.");
  } catch(e) { alert("Erro Memed: " + e.message); }
}

const docStyle = {fontFamily:"'Times New Roman',Georgia,serif",padding:"24px 28px",maxWidth:580,background:"#fff",border:"1px solid #ccc",borderRadius:4,marginBottom:20};
const editStyle = {border:"none",borderBottom:"1px solid #aaa",background:"transparent",fontFamily:"inherit",fontSize:"inherit",color:"inherit",width:"100%",outline:"none",padding:"2px 0",resize:"vertical",lineHeight:"inherit"};

function Cabecalho({medico}) {
  return (
    <div style={{borderBottom:"1.5px solid #333",paddingBottom:8,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#333",marginBottom:4}}>
        <span>(27) 99257-6838</span>
        <span>@drafernandajudice</span>
        <span>judicefernanda@gmail.com</span>
      </div>
      <div style={{textAlign:"center",fontSize:10,color:"#333",marginBottom:4}}>CRM-RJ 52-130371 | CRM-ES 20169</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,letterSpacing:3,color:"#000",fontFamily:"'Palatino Linotype','Book Antiqua',serif"}}>DRA.FERNANDA JUDICE</div>
        <div style={{fontSize:11,letterSpacing:2,color:"#333",marginTop:1}}>PSIQUIATRIA | SAÚDE MENTAL</div>
      </div>
    </div>
  );
}

function Assinatura({medico}) {
  return (
    <div style={{textAlign:"center",marginTop:8}}>
      {medico?.assinatura_url ? <img src={medico.assinatura_url} style={{maxWidth:"260px",maxHeight:"70px",objectFit:"contain",display:"block",margin:"0 auto"}} alt="Assinatura"/> : <img src="/assinatura.jpg" style={{maxWidth:"260px",maxHeight:"70px",objectFit:"contain",display:"block",margin:"0 auto"}} alt="Assinatura"/>}
      <div style={{fontSize:10,color:"#555",marginTop:2}}>{medico?.nome || "Dra. Fernanda S. Abreu Júdice"}</div>
      <div style={{fontSize:10,color:"#555"}}>{medico?.crm || "CRM-ES 20169 | CRM-RJ 52-0130371-6"}</div>
    </div>
  );
}

function BtnImprimir() {
  return <button onClick={()=>window.print()} style={{background:"#1a3a5c",color:"#fff",border:"none",borderRadius:4,padding:"6px 16px",cursor:"pointer",fontSize:11,marginTop:10}}>🖨️ Imprimir / Salvar PDF</button>;
}

function Editavel({valor, onChange, multiline, style}) {
  if (multiline) {
    return <textarea value={valor} onChange={e=>onChange(e.target.value)} style={{...editStyle, minHeight:80, ...style}}/>;
  }
  return <input type="text" value={valor} onChange={e=>onChange(e.target.value)} style={{...editStyle, ...style}}/>;
}

function ReceitaControle({receitas, onChangeReceita, onAddReceita, onRemoveReceita, num, total, nomePaciente, perfilMedico}) {
  return (
    <div style={docStyle}>
      <div style={{fontSize:10,color:"#333",marginBottom:6}}>
        <div>1ª VIA - FARMÁCIA</div>
        <div>2ª VIA - PACIENTE</div>
      </div>
      <div style={{fontSize:12,marginBottom:4}}>
        Paciente: <input type="text" value={nomePaciente||""} onChange={e=>onChangeReceita&&onChangeReceita("paciente",e.target.value)} style={{...editStyle,minWidth:300}}/>
      </div>
      <div style={{fontSize:12,marginBottom:12}}>
        Endereço: <input type="text" style={{...editStyle,minWidth:295}} placeholder="___"/>
      </div>
      <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Prescrição:</div>
      {total > 1 && <div style={{fontSize:10,color:"#888",marginBottom:6}}>Receita {num} de {total}</div>}
      {receitas.map((r,i)=>(
        <div key={i} style={{marginBottom:12,padding:"8px",background:"#f9f9f9",borderRadius:4,border:"1px solid #eee"}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:"#888",marginBottom:2}}>Medicamento:</div>
              <input type="text" value={r.medicamento} onChange={e=>onChangeReceita(i,"medicamento",e.target.value)} style={{...editStyle,fontWeight:700,fontSize:13}}/>
              <div style={{fontSize:11,color:"#888",marginTop:4,marginBottom:2}}>Posologia:</div>
              <input type="text" value={r.posologia} onChange={e=>onChangeReceita(i,"posologia",e.target.value)} style={{...editStyle,fontSize:12}}/>
              <div style={{fontSize:11,color:"#888",marginTop:4,marginBottom:2}}>Observação:</div>
              <input type="text" value={r.observacao||""} onChange={e=>onChangeReceita(i,"observacao",e.target.value)} style={{...editStyle,fontSize:11,color:"#666",fontStyle:"italic"}} placeholder="opcional"/>
            </div>
            <button onClick={()=>onRemoveReceita(i)} style={{background:"#e74c3c",color:"#fff",border:"none",borderRadius:3,padding:"4px 8px",cursor:"pointer",fontSize:11,flexShrink:0}}>✕</button>
          </div>
        </div>
      ))}
      <button onClick={onAddReceita} style={{background:"#27ae60",color:"#fff",border:"none",borderRadius:4,padding:"5px 12px",cursor:"pointer",fontSize:11,marginBottom:12}}>+ Adicionar medicamento</button>
      <div style={{marginTop:16,display:"flex",justifyContent:"space-between",fontSize:10,color:"#444",borderTop:"1px solid #ccc",paddingTop:12}}>
        <div>
          <div style={{fontWeight:700,marginBottom:4}}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div>Nome: ___________________________</div>
          <div style={{height:4}}/>
          <div>Ident: ___________ Org Emissor: ___</div>
          <div style={{height:4}}/>
          <div>End: ____________________________</div>
          <div style={{height:4}}/>
          <div>Cidade: ______________ UF: _______</div>
          <div style={{height:4}}/>
          <div>Telefone: _______________________</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontWeight:700,marginBottom:4}}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div>_______________ Data: ___/___/____</div>
          <div style={{marginTop:14}}>Assinatura do Fornecedor</div>
        </div>
      </div>
      <div style={{marginTop:16,textAlign:"center",fontSize:11}}>
        <div style={{borderTop:"1px solid #333",paddingTop:4,display:"inline-block",minWidth:260}}>Carimbo e Assinatura</div>
      </div>
      <div style={{marginTop:8,textAlign:"right",fontSize:11,color:"#555"}}>
        _____________________, ______ de __________________ de ________
      </div>
      <div style={{marginTop:16,borderTop:"1.5px solid #333",paddingTop:8,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:2,marginBottom:4}}>RECEITUÁRIO DE CONTROLE ESPECIAL</div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#555",marginBottom:4}}>
          <span>(27) 99257-6838</span><span>@drafernandajudice</span><span>judicefernanda@gmail.com</span>
        </div>
        <div style={{fontSize:9,color:"#555",marginBottom:4}}>CRM-RJ 52-130371 | CRM-ES 20169</div>
        <div style={{fontSize:14,fontWeight:700,letterSpacing:2,fontFamily:"'Palatino Linotype',serif"}}>DRA.FERNANDA JUDICE</div>
        <div style={{fontSize:10,letterSpacing:1,color:"#333"}}>PSIQUIATRIA | SAÚDE MENTAL</div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
        <BtnImprimir/>
        <button onClick={()=>abrirMemed(receitas,nomePaciente)} style={{background:"#00c853",color:"#fff",border:"none",borderRadius:4,padding:"6px 16px",cursor:"pointer",fontSize:11,fontWeight:700}}>
          💊 Abrir no Memed e Assinar
        </button>
      </div>
    </div>
  );
}

function Atestado({dados, onChange, perfilMedico}) {
  return (
    <div style={docStyle}>
      <Cabecalho medico={perfilMedico}/>
      <div style={{fontSize:14,fontWeight:700,textAlign:"center",marginBottom:20,letterSpacing:2,marginTop:8}}>ATESTADO MÉDICO</div>
      <div style={{fontSize:12,lineHeight:2.4}}>
        Atesto, para os devidos fins, que o(a) paciente{" "}
        <input type="text" value={dados.paciente||""} onChange={e=>onChange("paciente",e.target.value)} style={{...editStyle,minWidth:200}} placeholder="nome do paciente"/>{" "}
        foi atendido(a) no dia <strong>{hojeSlash()}</strong>, necessitando de{" "}
        <input type="text" value={dados.dias||""} onChange={e=>onChange("dias",e.target.value)} style={{...editStyle,width:30}} placeholder="N"/>{" "}
        (<input type="text" value={dados.diasExtenso||""} onChange={e=>onChange("diasExtenso",e.target.value)} style={{...editStyle,width:80}} placeholder="extenso"/>){" "}
        dias de afastamento de suas atividades laborais por motivo de doença, a partir desta data.
      </div>
      <div style={{marginTop:12,fontSize:12}}>
        CID: <input type="text" value={dados.cid||""} onChange={e=>onChange("cid",e.target.value)} style={{...editStyle,width:100}} placeholder="opcional"/> <em style={{fontSize:10}}>(com autorização do paciente)</em>
      </div>
      <div style={{marginTop:32,fontSize:11}}>
        <div>________________________, _____ de ______________ de _________</div>
      </div>
      <Assinatura medico={perfilMedico}/>
      <BtnImprimir/>
    </div>
  );
}

function DeclaracaoComparecimento({dados, onChange, perfilMedico}) {
  return (
    <div style={docStyle}>
      <Cabecalho medico={perfilMedico}/>
      <div style={{fontSize:14,fontWeight:700,textAlign:"center",marginBottom:20,letterSpacing:2,marginTop:8}}>DECLARAÇÃO DE COMPARECIMENTO</div>
      <div style={{fontSize:12,lineHeight:2.4}}>
        Declaro para os devidos fins que{" "}
        <input type="text" value={dados.paciente||""} onChange={e=>onChange("paciente",e.target.value)} style={{...editStyle,minWidth:200}} placeholder="nome do paciente"/>{" "}
        compareceu para consulta médica no dia <strong>{hojeSlash()}</strong> das{" "}
        <input type="text" value={dados.horaInicio||""} onChange={e=>onChange("horaInicio",e.target.value)} style={{...editStyle,width:50}} placeholder="00:00"/>{" "}
        às{" "}
        <input type="text" value={dados.horaFim||""} onChange={e=>onChange("horaFim",e.target.value)} style={{...editStyle,width:50}} placeholder="00:00"/>.
      </div>
      <div style={{marginTop:32,fontSize:11}}>
        <div>_______________________, _____ de ______________ de _________</div>
      </div>
      <Assinatura medico={perfilMedico}/>
      <BtnImprimir/>
    </div>
  );
}

function Laudo({texto, onChange, perfilMedico}) {
  return (
    <div style={docStyle}>
      <Cabecalho medico={perfilMedico}/>
      <div style={{fontSize:14,fontWeight:700,textAlign:"center",marginBottom:4,letterSpacing:2,marginTop:8}}>LAUDO MÉDICO</div>
      <div style={{fontSize:11,textAlign:"right",color:"#555",marginBottom:16}}>{hoje()}</div>
      <textarea
        value={texto}
        onChange={e=>onChange(e.target.value)}
        style={{...editStyle,minHeight:200,fontSize:12,lineHeight:2,color:"#333",resize:"vertical",width:"100%",boxSizing:"border-box"}}
      />
      <div style={{marginTop:36,textAlign:"center",fontSize:11}}>
        <div>________________________, _____ de ______________ de _________</div>
      </div>
      <Assinatura medico={perfilMedico}/>
      <BtnImprimir/>
    </div>
  );
}

function SolicitacaoExames({selecionados, onToggle, indicacao, onChangeIndicacao, nomePaciente, onChangeNome, perfilMedico}) {
  return (
    <div style={{...docStyle,maxWidth:680}}>
      <Cabecalho medico={perfilMedico}/>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:12,marginTop:8,alignItems:"center"}}>
        <span>NOME: <input type="text" value={nomePaciente||""} onChange={e=>onChangeNome(e.target.value)} style={{...editStyle,minWidth:220}} placeholder="nome do paciente"/></span>
        <span>DATA: {hojeSlash()}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
        {Object.entries(EXAMES_LISTA).map(([cat,lista])=>(
          <div key={cat} style={{marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:11,color:"#000",borderBottom:"1px solid #ccc",marginBottom:4,textTransform:"uppercase"}}>{cat}</div>
            {lista.map(e=>(
              <div key={e} onClick={()=>onToggle(e)} style={{fontSize:11,padding:"2px 0",cursor:"pointer",color:selecionados.includes(e)?"#1a3a5c":"#999",fontWeight:selecionados.includes(e)?700:400}}>
                {selecionados.includes(e)?"☑":"☐"} {e}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{marginTop:12,borderTop:"1px solid #ccc",paddingTop:8,fontSize:11}}>
        <strong>INDICAÇÃO:</strong>{" "}
        <input type="text" value={indicacao||""} onChange={e=>onChangeIndicacao(e.target.value)} style={{...editStyle,minWidth:300}}/>
      </div>
      <Assinatura medico={perfilMedico}/>
      <BtnImprimir/>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [perfilMedico, setPerfilMedico] = useState(null);
  const [transcricao, setTranscricao] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [tab, setTab] = useState("input");
  const [showAnamnese, setShowAnamnese] = useState(false);
  const [dadosClinicos, setDadosClinicos] = useState({});
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [leuTermos, setLeuTermos] = useState(false);

  const [evolucao, setEvolucao] = useState("");
  const [raciocinio, setRaciocinio] = useState("");
  const [laudo, setLaudo] = useState("");
  const [receitas, setReceitas] = useState([]);
  const [receitas2, setReceitas2] = useState([]);
  const [exames, setExames] = useState([]);
  const [indicacaoExames, setIndicacaoExames] = useState("");
  const [dadosAtestado, setDadosAtestado] = useState({paciente:"",dias:"",diasExtenso:"",cid:""});
  const [dadosComparecimento, setDadosComparecimento] = useState({paciente:"",horaInicio:"",horaFim:""});
  const [precisaAtestado, setPrecisaAtestado] = useState(false);

  const handleAnamneseConfirm = (dados) => {
    setDadosClinicos(dados);
    setShowAnamnese(false);
    analisar();
  };

  const analisar = async () => {
    if (!transcricao.trim()) return;
    setLoading(true);
    setErro("");
    setResultado(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":API_KEY,
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body: JSON.stringify({
          model:MODEL, max_tokens:4000, system:getSystemPrompt("psiquiatria", perfilMedico),
          messages:[{role:"user", content:"Transcrição da consulta:\n"+transcricao}]
        })
      });
      const data = await res.json();
      const text = (data.content||[]).map(i=>i.text||"").join("");
      let parsed = null;
      try {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
      } catch(e) { console.error(e,text); }

      if (parsed) {
        const comuns = parsed.receita_comum||[];
        const extras = comuns.filter(m=>ehControlado(m.medicamento));
        const naoControlados = comuns.filter(m=>!ehControlado(m.medicamento));
        parsed.receita_comum = naoControlados;
        parsed.receita_controlada = [...(parsed.receita_controlada||[]),...extras];

        setResultado(parsed);
        // BUG FIX: converte \n literal em quebras de linha reais
        setEvolucao(fixNewlines(parsed.evolucao));
        setRaciocinio(fixNewlines(parsed.raciocinio_farmacologico));
        setLaudo(fixNewlines(parsed.laudo_pessoal));
        setReceitas(parsed.receita_controlada||[]);
        setReceitas2(parsed.receita_controlada2||[]);
        setExames(parsed.exames_solicitados||[]);
        setIndicacaoExames(parsed.indicacao_exames||"");
        setPrecisaAtestado(parsed.precisa_atestado||false);
        setDadosAtestado({paciente:nomePaciente,dias:String(parsed.dias_afastamento||""),diasExtenso:fixNewlines(parsed.dias_extenso),cid:parsed.cid_atestado||""});
        setDadosComparecimento({paciente:nomePaciente,horaInicio:"",horaFim:""});
        setTab("analise");
      } else {
        setErro("Não foi possível interpretar. Tente novamente.");
      }
    } catch(e) { setErro("Erro: "+e.message); }
    setLoading(false);
  };

  const addReceita = (lista, setLista) => {
    setLista([...lista, {medicamento:"",posologia:"",observacao:""}]);
  };

  const toggleExame = (exame) => {
    setExames(prev => prev.includes(exame) ? prev.filter(e=>e!==exame) : [...prev,exame]);
  };

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{padding:"8px 14px",borderRadius:"6px 6px 0 0",border:"none",cursor:"pointer",fontSize:12,fontWeight:tab===id?700:400,background:tab===id?"#1a3a5c":"transparent",color:tab===id?"#fff":"#888"}}>
      {label}
    </button>
  );

  const SecTitle = ({t}) => <div style={{fontSize:14,fontWeight:700,color:"#1a3a5c",borderBottom:"2px solid #1a3a5c",paddingBottom:4,marginBottom:12}}>{t}</div>;

  const allReceitas = [...receitas,...receitas2];
  const grupos = [];
  for (let i=0;i<allReceitas.length;i+=3) grupos.push(allReceitas.slice(i,i+3));

  if (checkingAuth) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#2c1f1f,#3d2929)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#CCA968",fontSize:13,letterSpacing:2,fontFamily:"Montserrat,sans-serif"}}>CARREGANDO...</div>
    </div>
  );

  if (!user) return <LandingLogin onLogin={setUser}/>;
  if (!perfilMedico) return <Onboarding user={user} onComplete={setPerfilMedico}/>;

  if (!aceitouTermos) {
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{background:"#fff",borderRadius:12,maxWidth:580,width:"100%",overflow:"hidden"}}>
          <div style={{background:"#B08B8C",padding:"16px 28px",textAlign:"center"}}>
            <div style={{fontSize:20,color:"#fff",letterSpacing:5,textTransform:"uppercase"}}>DRA. FERNANDA JUDICE</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.9)",letterSpacing:3,marginTop:2}}>ASSISTENTE CLÍNICO · PSIQUIATRIA & SAÚDE MENTAL</div>
          </div>
          <div style={{padding:28}}>
            <div style={{fontSize:15,fontWeight:700,color:"#B08B8C",marginBottom:16,textAlign:"center"}}>Termos de Uso e Privacidade</div>
            <div style={{background:"#f9f9f9",border:"1px solid #eee",borderRadius:8,padding:16,maxHeight:300,overflowY:"auto",fontSize:12,lineHeight:1.8}} onScroll={()=>setLeuTermos(true)}>
              <p><strong>1. SOBRE O SERVIÇO</strong><br/>Este assistente utiliza IA para auxiliar profissionais de saúde. Destinado exclusivamente a profissionais habilitados.</p>
              <p><strong>2. RESPONSABILIDADE CLÍNICA</strong><br/>Todo conteúdo gerado é sugestão de apoio. O médico é responsável por revisar e assinar qualquer documento.</p>
              <p><strong>3. PROTEÇÃO DE DADOS — LGPD</strong><br/>Este app não armazena transcrições nem dados de pacientes. Não insira CPF ou dados identificadores dos pacientes.</p>
              <p><strong>4. BOAS PRÁTICAS</strong><br/>Use iniciais nas transcrições. Revise sempre antes de assinar.</p>
              <p><strong>5. CONTATO</strong><br/>judicefernanda@gmail.com</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:16,marginBottom:20}}>
              <input type="checkbox" id="aceite" checked={leuTermos} onChange={e=>setLeuTermos(e.target.checked)} style={{width:16,height:16}}/>
              <label htmlFor="aceite" style={{fontSize:13,cursor:"pointer"}}>Li e concordo com os Termos de Uso</label>
            </div>
            <button onClick={()=>leuTermos && setAceitouTermos(true)} style={{background:leuTermos?"#B08B8C":"#ccc",color:"#fff",border:"none",borderRadius:8,padding:"12px 32px",fontSize:14,cursor:"pointer",fontWeight:700,width:"100%"}}>
              Acessar o Assistente Clínico
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#f5f5f5",borderRadius:12,padding:28,maxWidth:900,margin:"0 auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <div style={{fontSize:22,fontWeight:700,color:"#1a3a5c",letterSpacing:2,textAlign:"center",marginBottom:2,fontFamily:"'Palatino Linotype',serif"}}>DRA. FERNANDA JUDICE</div>
        <div style={{fontSize:12,color:"#888",textAlign:"center",marginBottom:24,letterSpacing:1}}>ASSISTENTE CLÍNICO · PSIQUIATRIA & SAÚDE MENTAL</div>

        <div style={{display:"flex",gap:4,borderBottom:"2px solid #ddd",flexWrap:"wrap",marginBottom:20}}>
          <Tab id="input" label="📝 Transcrição"/>
          {resultado && <Tab id="analise" label="🧠 Análise"/>}
          {resultado && <Tab id="receitas" label="💊 Receituários"/>}
          {resultado && <Tab id="exames" label="🔬 Exames"/>}
          {resultado && <Tab id="laudo" label="📋 Laudo"/>}
          {resultado && <Tab id="comparecimento" label="📄 Comparecimento"/>}
          {resultado && precisaAtestado && <Tab id="atestado" label="📋 Atestado"/>}
        </div>

        {tab==="input" && (
          <div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,color:"#555",display:"block",marginBottom:4}}>Nome do paciente:</label>
              <input type="text" value={nomePaciente} onChange={e=>setNomePaciente(e.target.value)} placeholder="Digite o nome do paciente" style={{width:"100%",border:"1px solid #ccc",borderRadius:6,padding:"10px 14px",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{fontSize:13,color:"#555",display:"block",marginBottom:4}}>Transcrição da consulta:</label>
              <textarea value={transcricao} onChange={e=>setTranscricao(e.target.value)} placeholder="Cole aqui a transcrição da consulta..." style={{width:"100%",minHeight:200,border:"1px solid #ccc",borderRadius:6,padding:14,fontSize:13,resize:"vertical",outline:"none",lineHeight:1.7,boxSizing:"border-box",fontFamily:"Georgia,serif",background:"#fff"}}/>
            </div>
            {erro && <div style={{background:"#fdecea",border:"1px solid #e74c3c",borderRadius:6,padding:12,color:"#c0392b",fontSize:13,marginTop:10}}>{erro}</div>}
            <button onClick={()=>setShowAnamnese(true)} disabled={loading} style={{background:"#1a3a5c",color:"#fff",border:"none",borderRadius:6,padding:"13px 32px",fontSize:14,cursor:"pointer",fontWeight:700,marginTop:12,width:"100%",letterSpacing:1}}>
              {loading?"⏳ Analisando consulta...":"⚡ Preencher Dados e Gerar"}
            </button>
          </div>
        )}

        {tab==="analise" && resultado && (
          <div>
            <div style={{marginBottom:20}}>
              <SecTitle t="📋 Evolução Clínica"/>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>✏️ Clique para editar</div>
              <textarea value={evolucao} onChange={e=>setEvolucao(e.target.value)} style={{width:"100%",minHeight:150,border:"1px solid #ccc",borderRadius:6,padding:12,fontSize:13,lineHeight:1.8,outline:"none",resize:"vertical",fontFamily:"Georgia,serif",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:20}}>
              <SecTitle t="🎯 Hipóteses Diagnósticas"/>
              <div>{(resultado.diagnosticos||[]).map((d,i)=><span key={i} style={{display:"inline-block",background:"#1a3a5c",color:"#fff",borderRadius:4,padding:"3px 12px",fontSize:11,marginRight:6,marginBottom:4}}>{d}</span>)}</div>
            </div>
            <div>
              <SecTitle t="💊 Raciocínio Farmacológico"/>
              <div style={{fontSize:11,color:"#888",marginBottom:4}}>✏️ Clique para editar</div>
              <textarea value={raciocinio} onChange={e=>setRaciocinio(e.target.value)} style={{width:"100%",minHeight:120,border:"1px solid #aed6f1",borderRadius:6,padding:12,fontSize:13,lineHeight:1.8,color:"#1a5276",outline:"none",resize:"vertical",fontFamily:"Georgia,serif",boxSizing:"border-box",background:"#eaf4fb"}}/>
            </div>
          </div>
        )}

        {tab==="receitas" && (
          <div>
            {grupos.length===0 && (
              <div>
                <div style={{color:"#888",fontSize:13,marginBottom:12}}>Nenhuma prescrição gerada.</div>
                <button onClick={()=>setReceitas([{medicamento:"",posologia:"",observacao:""}])} style={{background:"#1a3a5c",color:"#fff",border:"none",borderRadius:4,padding:"8px 16px",cursor:"pointer",fontSize:12}}>+ Criar receita</button>
              </div>
            )}
            {grupos.map((g,i)=>(
              <div key={i} style={{marginBottom:20}}>
                <SecTitle t={`🔒 Receituário de Controle Especial${grupos.length>1?` (${i+1}/${grupos.length})`:""}`}/>
                <ReceitaControle
                  receitas={g}
                  num={i+1}
                  total={grupos.length}
                  nomePaciente={nomePaciente}
                  perfilMedico={perfilMedico}
                  onChangeReceita={(idx,campo,valor)=>{
                    const offset = i*3;
                    const nova = [...receitas,...receitas2];
                    nova[offset+idx] = {...nova[offset+idx],[campo]:valor};
                    setReceitas(nova.slice(0,receitas.length));
                    setReceitas2(nova.slice(receitas.length));
                  }}
                  onAddReceita={()=>addReceita(receitas,setReceitas)}
                  onRemoveReceita={(idx)=>{
                    const offset = i*3;
                    const nova = [...receitas,...receitas2];
                    nova.splice(offset+idx,1);
                    setReceitas(nova.slice(0,Math.max(receitas.length-1,0)));
                    setReceitas2(nova.slice(Math.max(receitas.length-1,0)));
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {tab==="exames" && (
          <div>
            <SecTitle t="🔬 Solicitação de Exames"/>
            <div style={{fontSize:11,color:"#888",marginBottom:8}}>✏️ Clique nos exames para marcar/desmarcar</div>
            <SolicitacaoExames
              selecionados={exames}
              onToggle={toggleExame}
              indicacao={indicacaoExames}
              onChangeIndicacao={setIndicacaoExames}
              nomePaciente={nomePaciente}
              onChangeNome={setNomePaciente}
              perfilMedico={perfilMedico}
            />
          </div>
        )}

        {tab==="laudo" && (
          <div>
            <SecTitle t="📋 Laudo Médico Pessoal"/>
            <div style={{fontSize:11,color:"#888",marginBottom:8}}>✏️ Clique para editar</div>
            <Laudo texto={laudo} onChange={setLaudo} perfilMedico={perfilMedico}/>
          </div>
        )}

        {tab==="comparecimento" && (
          <div>
            <SecTitle t="📄 Declaração de Comparecimento"/>
            <DeclaracaoComparecimento
              dados={dadosComparecimento}
              onChange={(campo,valor)=>setDadosComparecimento(prev=>({...prev,[campo]:valor}))}
              perfilMedico={perfilMedico}
            />
          </div>
        )}

        {tab==="atestado" && precisaAtestado && (
          <div>
            <SecTitle t="📋 Atestado Médico"/>
            <Atestado
              dados={dadosAtestado}
              onChange={(campo,valor)=>setDadosAtestado(prev=>({...prev,[campo]:valor}))}
              perfilMedico={perfilMedico}
            />
          </div>
        )}
      </div>

      {showAnamnese && (
        <AnamneseEspecialidade
          especialidade={perfilMedico?.especialidade || "clinica_geral"}
          onConfirm={handleAnamneseConfirm}
          onCancel={()=>setShowAnamnese(false)}
        />
      )}
    </div>
  );
}
