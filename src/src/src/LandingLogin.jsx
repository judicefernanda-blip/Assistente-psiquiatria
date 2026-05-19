import React, { useState } from "react";
import { supabase } from "./auth";
import DemoAnimada from "./DemoAnimada";

const ROSE = "#B08B8C";
const GOLD = "#CCA968";

export default function LandingLogin({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  const entrar = async () => {
    setLoading(true);
    setErro("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) { setErro("Email ou senha incorretos."); setLoading(false); return; }
    onLogin(data.user);
    setLoading(false);
  };

  const cadastrar = async () => {
    setLoading(true);
    setErro("");
    const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome, crm } } });
    if (error) { setErro(error.message); setLoading(false); return; }
    if (data.user) await supabase.from("medicos").update({ nome, crm }).eq("id", data.user.id);
    setMsg("Conta criada! Verifique seu email para confirmar.");
    setLoading(false);
  };

  const assinar = () => {
    window.open(`https://buy.stripe.com/test/price_1TWloLD5mev9NQlD0IWdDP0w?prefilled_email=${encodeURIComponent(email)}`, "_blank");
  };

  return (
    <div style={{fontFamily:"'Montserrat',sans-serif",color:"#333"}}>

      {/* NAV */}
      <nav style={{background:"#fff",padding:"16px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f0eded",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontSize:13,fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:ROSE}}>Medicina IA</div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <button onClick={()=>{setModo("login");setShowModal(true);}} style={{background:"transparent",border:"none",fontSize:13,color:"#888",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontWeight:500}}>Entrar</button>
          <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{background:ROSE,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>Assinar agora</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:"linear-gradient(135deg,#2c1f1f 0%,#3d2929 50%,#2c1f1f 100%)",padding:"100px 40px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${GOLD},${ROSE},${GOLD})`}}/>
        <div style={{display:"inline-block",background:"rgba(204,169,104,0.2)",color:GOLD,border:`1px solid rgba(204,169,104,0.4)`,padding:"6px 16px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",marginBottom:24}}>Inteligência Artificial para Médicos</div>
        <h1 style={{fontSize:52,fontWeight:300,color:"#fff",letterSpacing:6,textTransform:"uppercase",lineHeight:1.2,marginBottom:8}}>DRA.<span style={{color:GOLD}}>FERNANDA</span><br/>JUDICE</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",letterSpacing:4,textTransform:"uppercase",marginBottom:24}}>Psiquiatria | Saúde Mental</p>
        <p style={{fontSize:17,color:"rgba(255,255,255,0.75)",maxWidth:580,margin:"0 auto 40px",lineHeight:1.8,fontWeight:300}}>Da transcrição da consulta aos documentos clínicos prontos para assinar. Receituários, laudos, exames e atestados gerados em segundos.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{background:GOLD,color:"#2c1f1f",border:"none",padding:"16px 40px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Assinar — R$ 5.000/mês</button>
          <a href="https://medicina-ia-clinica.vercel.app" target="_blank" style={{background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",padding:"16px 40px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:500,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",textDecoration:"none",display:"inline-block"}}>Ver demo ao vivo →</a>
          <button onClick={()=>{setModo("login");setShowModal(true);}} style={{background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",padding:"16px 40px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:500,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Já tenho conta</button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 40px",background:"#faf8f7"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>Funcionalidades</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:300,letterSpacing:2,marginBottom:8}}>Tudo que você precisa</h2>
        <p style={{textAlign:"center",fontSize:15,color:"#888",marginBottom:60,fontWeight:300}}>Da consulta ao documento assinado em minutos</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {[
            {icon:"🧠",title:"IA Clínica Avançada",desc:"Raciocínio farmacológico baseado em Stahl 2024, Maudsley 2024, CANMAT 2023, APA 2023 e Harvard Algorithms."},
            {icon:"💊",title:"Receituários Automáticos",desc:"Receita comum e controle especial geradas automaticamente no layout correto com sua assinatura."},
            {icon:"📋",title:"Laudos Completos",desc:"Laudos médicos personalizados para cada paciente — INSS, trabalho, escola ou uso pessoal."},
            {icon:"🔬",title:"Solicitação de Exames",desc:"Painel completo selecionado automaticamente conforme o quadro clínico."},
            {icon:"✍️",title:"Tudo Editável",desc:"Edite qualquer campo antes de imprimir. A IA sugere, você decide."},
            {icon:"🔒",title:"Seguro e Privado",desc:"Nenhum dado de paciente armazenado. Conformidade com LGPD."},
          ].map((f,i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #f0eded",borderRadius:8,padding:32}}>
              <div style={{width:48,height:48,background:`linear-gradient(135deg,${ROSE},${GOLD})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:20}}>{f.icon}</div>
              <h3 style={{fontSize:14,fontWeight:600,letterSpacing:1,marginBottom:10,textTransform:"uppercase"}}>{f.title}</h3>
              <p style={{fontSize:13,color:"#777",lineHeight:1.7,fontWeight:300}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"80px 40px",background:"#fff"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>Como funciona</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:300,letterSpacing:2,marginBottom:8}}>Simples como deve ser</h2>
        <p style={{textAlign:"center",fontSize:15,color:"#888",marginBottom:60,fontWeight:300}}>Três passos do atendimento ao documento pronto</p>
        <div style={{display:"flex",gap:0,maxWidth:900,margin:"0 auto",flexWrap:"wrap"}}>
          {[
            {num:"1",title:"Transcreva",desc:"Cole a transcrição da consulta — seu gravador já faz isso automaticamente."},
            {num:"2",title:"Gere",desc:"A IA analisa e gera evolução, diagnóstico, receituários, laudos e exames em segundos."},
            {num:"3",title:"Assine",desc:"Revise, edite se necessário e assine digitalmente pelo Memed ou imprima."},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,minWidth:200,textAlign:"center",padding:"0 20px"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:ROSE,color:"#fff",fontSize:22,fontWeight:300,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{s.num}</div>
              <h3 style={{fontSize:14,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{s.title}</h3>
              <p style={{fontSize:13,color:"#888",lineHeight:1.6,fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALTIES */}
      <section style={{padding:"80px 40px",background:"#faf8f7"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>Expansão</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:300,letterSpacing:2,marginBottom:8}}>Crescendo com você</h2>
        <p style={{textAlign:"center",fontSize:15,color:"#888",marginBottom:40,fontWeight:300}}>Hoje em psiquiatria. Em breve para toda a medicina.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",maxWidth:700,margin:"0 auto 40px"}}>
          {["✓ Psiquiatria — Disponível agora","Neurologia — Em breve","Cardiologia — Em breve","Endocrinologia — Em breve","Dermatologia — Em breve","Ginecologia — Em breve","Pediatria — Em breve"].map((s,i)=>(
            <span key={i} style={{background:i===0?ROSE:"#fff",color:i===0?"#fff":ROSE,border:`1px solid ${i===0?ROSE:"#e8e0e0"}`,borderRadius:20,padding:"10px 20px",fontSize:13,fontWeight:500}}>{s}</span>
          ))}
        </div>
        <div style={{maxWidth:520,margin:"0 auto",background:"#fff",border:"1px solid #f0eded",borderRadius:8,padding:32,textAlign:"center"}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:GOLD,marginBottom:8}}>Lista de espera</p>
          <h3 style={{fontSize:20,fontWeight:300,letterSpacing:1,marginBottom:8}}>Sua especialidade está chegando</h3>
          <p style={{fontSize:13,color:"#888",marginBottom:24,lineHeight:1.6}}>Cadastre seu email e seja o primeiro a saber quando lançarmos para sua área.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <input type="email" placeholder="seuemail@gmail.com" style={{flex:1,minWidth:200,padding:"12px 16px",border:"1px solid #e8e0e0",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",color:"#333"}}/>
            <button style={{background:ROSE,color:"#fff",border:"none",padding:"12px 24px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap"}}>Quero ser avisado</button>
          </div>
          <p style={{fontSize:11,color:"#bbb",marginTop:12}}>Sem spam. Só avisamos quando lançar.</p>
        </div>
      </section>


      {/* MOSTRUARIO */}
      <section style={{padding:"80px 40px",background:"#faf8f7"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>Plataforma</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:300,letterSpacing:2,marginBottom:8}}>Interface clínica premium</h2>
        <p style={{textAlign:"center",fontSize:15,color:"#888",marginBottom:48,fontWeight:300}}>Dashboard longitudinal, timeline do paciente e copiloto clínico integrado</p>

        <div style={{maxWidth:760,margin:"0 auto"}}>

          <div style={{background:"#fff",border:"1px solid #e8e0e0",borderRadius:12,overflow:"hidden",marginBottom:24}}>
            <div style={{background:"#2c1f1f",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{display:"flex",gap:4}}>
                  {["rgba(255,255,255,0.2)","rgba(255,255,255,0.2)","rgba(255,255,255,0.2)"].map((c,i)=>(
                    <div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>
                  ))}
                </div>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:2,textTransform:"uppercase"}}>Dashboard · Clínica Judice</span>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Dra. Fernanda Judice</span>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {[
                  {label:"Pacientes ativos",value:"47",sub:"+3 este mês"},
                  {label:"Consultas realizadas",value:"128",sub:"este mês"},
                  {label:"Docs gerados",value:"312",sub:"revisados"},
                  {label:"Em monitoramento",value:"23",sub:"acompan. ativo"},
                ].map((m,i)=>(
                  <div key={i} style={{background:"#f8f4f4",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#888",marginBottom:4}}>{m.label}</div>
                    <div style={{fontSize:20,fontWeight:500,color:"#333"}}>{m.value}</div>
                    <div style={{fontSize:10,color:"#aaa",marginTop:2}}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{background:"#f8f4f4",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Pacientes recentes</div>
                  {[
                    {init:"MR",name:"M. Ribeiro",diag:"F33.1 · Depressão",color:"#f8f0f0",text:"#8a5c5c",tag:"hoje"},
                    {init:"CS",name:"C. Santos",diag:"F41.1 · TAG",color:"#e8f5e9",text:"#2e7d32",tag:"ontem"},
                    {init:"JP",name:"J. Pereira",diag:"F31.2 · Bipolar II",color:"#e3f2fd",text:"#0d47a1",tag:"3 dias"},
                  ].map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<2?"0.5px solid #e8e0e0":"none"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:p.color,color:p.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500}}>{p.init}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:500,color:"#333"}}>{p.name}</div>
                        <div style={{fontSize:10,color:"#888"}}>{p.diag}</div>
                      </div>
                      <span style={{fontSize:9,background:"#fff",color:"#888",borderRadius:4,padding:"2px 6px"}}>{p.tag}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"#f8f4f4",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Alertas clínicos</div>
                  {[
                    {cor:"#c0392b",text:"M. Ribeiro — revisão de laudo pendente"},
                    {cor:"#e67e22",text:"C. Santos — 45 dias sem consulta"},
                    {cor:"#27ae60",text:"J. Pereira — resposta terapêutica positiva"},
                  ].map((a,i)=>(
                    <div key={i} style={{fontSize:11,color:"#555",padding:"6px 0",borderBottom:i<2?"0.5px solid #e8e0e0":"none",display:"flex",gap:6}}>
                      <span style={{color:a.cor,fontWeight:700}}>●</span>{a.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{background:"#fff",border:"1px solid #e8e0e0",borderRadius:12,overflow:"hidden",marginBottom:24}}>
            <div style={{background:"#2c1f1f",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:2,textTransform:"uppercase"}}>M. Ribeiro · F33.1 · 14 meses de acompanhamento</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>última consulta: hoje</span>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div style={{background:"#f8f4f4",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Evolução longitudinal de sintomas</div>
                  <svg width="100%" height="70" viewBox="0 0 240 70">
                    <polyline points="0,60 30,52 60,44 90,36 120,30 150,24 180,18 210,14 240,12" fill="none" stroke="#B08B8C" strokeWidth="2"/>
                    <polyline points="0,65 30,60 60,55 90,50 120,47 150,43 180,40 210,38 240,36" fill="none" stroke="#CCA968" strokeWidth="1.5" strokeDasharray="4,2"/>
                    <text x="0" y="69" fontSize="8" fill="#aaa">Jan</text>
                    <text x="80" y="69" fontSize="8" fill="#aaa">Abr</text>
                    <text x="160" y="69" fontSize="8" fill="#aaa">Jul</text>
                    <text x="210" y="69" fontSize="8" fill="#aaa">Out</text>
                  </svg>
                  <div style={{display:"flex",gap:12,marginTop:4}}>
                    <span style={{fontSize:9,color:"#8a5c5c"}}>■ Humor</span>
                    <span style={{fontSize:9,color:"#7a5c00"}}>■ Ansiedade</span>
                  </div>
                </div>
                <div style={{background:"#f8f4f4",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Histórico terapêutico</div>
                  {[
                    {name:"Escitalopram 20mg",info:"desde jan/25 · boa resposta",status:"em uso",color:"#e8f5e9",text:"#2e7d32"},
                    {name:"Clonazepam 0,5mg",info:"jan-mar/25 · suspensão",status:"suspenso",color:"#f8f4f4",text:"#888"},
                    {name:"Fluoxetina 40mg",info:"2023 · falha terapêutica",status:"falha",color:"#fdecea",text:"#c0392b"},
                  ].map((m,i)=>(
                    <div key={i} style={{padding:"6px 0",borderBottom:i<2?"0.5px solid #e8e0e0":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:11,fontWeight:500,color:"#333"}}>{m.name}</div>
                        <div style={{fontSize:10,color:"#888"}}>{m.info}</div>
                      </div>
                      <span style={{fontSize:9,background:m.color,color:m.text,borderRadius:4,padding:"2px 6px"}}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:"#f8f4f4",borderRadius:8,padding:12,marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Timeline longitudinal</div>
                {[
                  {cor:"#B08B8C",date:"hoje · consulta",title:"Consulta de seguimento",desc:"Humor estabilizado. Sono regular. Mantendo escitalopram 20mg."},
                  {cor:"#CCA968",date:"15/abr · medicação",title:"Ajuste posológico",desc:"Aumento escitalopram 10→20mg por resposta parcial."},
                  {cor:"#27ae60",date:"jan/25 · início",title:"Início do tratamento atual",desc:"Episódio depressivo grave. Início escitalopram + clonazepam."},
                ].map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:i<2?10:0}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:t.cor,flexShrink:0}}/>
                      {i<2 && <div style={{width:1,flex:1,background:"#e0d4d4",margin:"2px 0"}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,color:"#aaa"}}>{t.date}</div>
                      <div style={{fontSize:11,fontWeight:500,color:"#333"}}>{t.title}</div>
                      <div style={{fontSize:10,color:"#888",lineHeight:1.4}}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:"#fdf6f6",border:"1px solid #e8d4d4",borderRadius:8,padding:12}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:ROSE}}/>
                  <span style={{fontSize:9,fontWeight:700,color:"#8a5c5c",textTransform:"uppercase",letterSpacing:1}}>Sugestão do copiloto clínico · Rascunho</span>
                </div>
                <div style={{fontSize:9,color:"#7a5c00",background:"#faf3e0",padding:"4px 8px",borderRadius:4,marginBottom:6}}>
                  As informações geradas possuem caráter auxiliar e devem ser obrigatoriamente revisadas e validadas pelo médico responsável.
                </div>
                <div style={{fontSize:11,color:"#555",lineHeight:1.5,marginBottom:6}}>
                  Possível estratégia terapêutica: manutenção do escitalopram 20mg com reavaliação em 30 dias. Considerar psicoterapia adjuvante conforme CANMAT 2023.
                </div>
                <div style={{fontSize:10,color:"#777",background:"#fff",borderRadius:4,padding:"6px 8px",lineHeight:1.5}}>
                  Sugestão baseada em:<br/>
                  · resposta parcial após 12 semanas · melhora longitudinal do humor<br/>
                  · ausência de sintomas maníacos · falha terapêutica prévia com fluoxetina
                </div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <span style={{fontSize:9,background:"#f0eded",color:"#888",padding:"3px 8px",borderRadius:4}}>Aguardando validação médica</span>
                  <span style={{fontSize:9,background:"#f0eded",color:"#888",padding:"3px 8px",borderRadius:4}}>Editar antes de usar</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* DEMO ANIMADA */}
      <section style={{padding:"80px 40px",background:"#fff"}}>
        <DemoAnimada onAssinar={()=>{setModo("cadastro");setShowModal(true);}}/>
      </section>


      {/* PROVA SOCIAL — MÉDICO USANDO O SISTEMA */}
      <section style={{padding:"80px 40px",background:"linear-gradient(135deg,#2c1f1f,#3d2929)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:GOLD,marginBottom:12}}>Na prática clínica</p>
            <h2 style={{fontSize:32,fontWeight:300,color:"#fff",letterSpacing:2,lineHeight:1.3,marginBottom:20}}>O workflow que médicos precisavam</h2>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",lineHeight:1.9,fontWeight:300,marginBottom:24}}>
              14 meses de acompanhamento de um paciente. Timeline completa, histórico terapêutico, evolução de sintomas e apoio à decisão — tudo em uma única tela.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
              {[
                "Prontuário longitudinal completo",
                "Timeline clínica desde o início do tratamento",
                "Resposta terapêutica documentada ao longo do tempo",
                "Apoio à decisão baseado no histórico real do paciente",
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"rgba(255,255,255,0.8)"}}>
                  <span style={{color:GOLD,fontSize:16,flexShrink:0}}>✓</span>{f}
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontStyle:"italic",lineHeight:1.6}}>
              "As sugestões clínicas possuem caráter auxiliar e requerem revisão e validação do médico responsável."
            </p>
          </div>
          <div style={{position:"relative"}}>
            <img 
              src="/medico-plataforma.jpg" 
              alt="Médico utilizando a plataforma Medicina IA" 
              style={{width:"100%",borderRadius:12,boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}
            />
            <div style={{position:"absolute",bottom:16,left:16,right:16,background:"rgba(26,18,16,0.85)",backdropFilter:"blur(8px)",borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#27ae60",flexShrink:0}}/>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#fff"}}>Prontuário longitudinal ao vivo</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>14 meses de acompanhamento em uma tela</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section style={{padding:"80px 40px",background:"#fff"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>Planos</p>
        <h2 style={{textAlign:"center",fontSize:32,fontWeight:300,letterSpacing:2,marginBottom:8}}>Invista no seu tempo</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20,maxWidth:1000,margin:"0 auto"}}>
  {[
    {plano:"Solo",preco:"5.000",sub:"/mês · 1 médico",features:["Copiloto clínico completo","Documentação assistida","Racional baseado em literatura","Laudos e documentos revisáveis","Auditoria e rastreabilidade"],destaque:false},
    {plano:"Clínica Pequena",preco:"15.000",sub:"/mês · até 5 médicos",features:["Tudo do plano Solo","Múltiplos médicos","Dashboard da clínica","Timeline longitudinal","Suporte prioritário"],destaque:true},
    {plano:"Clínica Média",preco:"25.000",sub:"/mês · até 15 médicos",features:["Tudo do plano Clínica Pequena","Até 15 médicos","Relatórios da clínica","Onboarding personalizado","Gestão de equipe"],destaque:false},
    {plano:"Enterprise",preco:null,sub:"sob consulta · ilimitado",features:["Médicos ilimitados","Integração com prontuário","API dedicada","SLA garantido","Implantação assistida"],destaque:false},
  ].map((p,i)=>(
    <div key={i} style={{border:p.destaque?`2px solid ${GOLD}`:`1px solid #f0eded`,borderRadius:8,padding:"32px 24px",textAlign:"center",position:"relative"}}>
      {p.destaque && <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:GOLD,color:"#2c1f1f",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",padding:"4px 14px",borderRadius:10}}>Mais escolhido</div>}
      <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:12}}>{p.plano}</p>
      {p.preco?<p style={{fontSize:40,fontWeight:300,lineHeight:1,marginBottom:4}}><sup style={{fontSize:16,verticalAlign:"top",marginTop:8,display:"inline-block"}}>R$</sup>{p.preco}</p>:<p style={{fontSize:28,fontWeight:300,paddingTop:8}}>Sob consulta</p>}
      <p style={{fontSize:11,color:"#aaa",marginBottom:24}}>{p.sub}</p>
      <ul style={{listStyle:"none",textAlign:"left",marginBottom:24}}>
        {p.features.map((f,j)=>(
          <li key={j} style={{fontSize:12,color:"#666",padding:"7px 0",borderBottom:"1px solid #f5f5f5",display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:GOLD,fontWeight:700}}>✓</span>{f}
          </li>
        ))}
      </ul>
      <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{width:"100%",padding:12,borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",border:p.destaque?"none":`1px solid ${ROSE}`,background:p.destaque?ROSE:"transparent",color:p.destaque?"#fff":ROSE}}>
        {p.preco?"Começar agora":"Falar com equipe"}
      </button>
    </div>
  ))}
</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24,maxWidth:900,margin:"0 auto"}}>
          <div style={{border:"1px solid #f0eded",borderRadius:8,padding:"40px 32px",textAlign:"center"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:ROSE,marginBottom:16}}>Solo</p>
            <p style={{fontSize:48,fontWeight:300,lineHeight:1,marginBottom:4}}><sup style={{fontSize:20,verticalAlign:"top",marginTop:10,display:"inline-block"}}>R$</sup>5.000</p>
            <p style={{fontSize:12,color:"#aaa",marginBottom:32,letterSpacing:1}}>/mês · 1 médico</p>
            <ul style={{listStyle:"none",textAlign:"left",marginBottom:32}}>
              {["Receituários ilimitados","Laudos e atestados","Solicitação de exames","Integração Memed","Seu layout personalizado"].map((f,i)=>(
                <li key={i} style={{fontSize:13,color:"#666",padding:"8px 0",borderBottom:"1px solid #f5f5f5",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:GOLD,fontWeight:700}}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{width:"100%",padding:14,borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",border:`1px solid ${ROSE}`,background:"transparent",color:ROSE}}>Começar agora</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg,#2c1f1f,#3d2929)",padding:"80px 40px",textAlign:"center"}}>
        <h2 style={{fontSize:36,fontWeight:300,color:"#fff",letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Comece hoje</h2>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.6)",marginBottom:40,fontWeight:300}}>Junte-se aos médicos que já economizam horas por semana</p>
        <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{background:GOLD,color:"#2c1f1f",border:"none",padding:"16px 48px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Quero testar agora</button>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px 40px",background:"#1a1a1a",textAlign:"center"}}>
        <p style={{fontSize:12,color:"#555",letterSpacing:1}}>© 2026 <span style={{color:GOLD}}>Medicina IA</span> · Dra. Fernanda Souza de Abreu Júdice · CRM-ES 20169 | CRM-RJ 52-0130371-6</p>
        <p style={{fontSize:12,color:"#555",marginTop:8}}>judicefernanda@gmail.com · (27) 99257-6838</p>
      </footer>

      {/* MODAL LOGIN */}
      {showModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div style={{background:"#fff",borderRadius:12,maxWidth:420,width:"100%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
            <div style={{background:ROSE,padding:"24px 32px",textAlign:"center",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:16,fontWeight:300,color:"#fff",letterSpacing:4,textTransform:"uppercase"}}>DRA. FERNANDA JUDICE</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.8)",letterSpacing:3,textTransform:"uppercase"}}>Assistente Clínico</div>
              </div>
              <button onClick={()=>setShowModal(false)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.7)",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:32}}>
              <div style={{display:"flex",marginBottom:24,borderBottom:"1px solid #f0eded"}}>
                <button onClick={()=>setModo("login")} style={{flex:1,padding:10,border:"none",background:"transparent",fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:modo==="login"?700:400,color:modo==="login"?ROSE:"#aaa",cursor:"pointer",borderBottom:modo==="login"?`2px solid ${ROSE}`:"2px solid transparent",letterSpacing:1,textTransform:"uppercase"}}>Entrar</button>
                <button onClick={()=>setModo("cadastro")} style={{flex:1,padding:10,border:"none",background:"transparent",fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:modo==="cadastro"?700:400,color:modo==="cadastro"?ROSE:"#aaa",cursor:"pointer",borderBottom:modo==="cadastro"?`2px solid ${ROSE}`:"2px solid transparent",letterSpacing:1,textTransform:"uppercase"}}>Criar conta</button>
              </div>

              {erro && <div style={{background:"#fdecea",border:"1px solid #e74c3c",borderRadius:4,padding:"10px 14px",color:"#c0392b",fontSize:12,marginBottom:12}}>{erro}</div>}
              {msg && <div style={{background:"#eafaf1",border:"1px solid #27ae60",borderRadius:4,padding:"10px 14px",color:"#1e8449",fontSize:12,marginBottom:12}}>{msg}</div>}

              {modo==="cadastro" && (
                <>
                  <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Nome completo</label>
                  <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Dra. Maria Silva"/>
                  <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>CRM</label>
                  <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} value={crm} onChange={e=>setCrm(e.target.value)} placeholder="CRM-ES 12345"/>
                </>
              )}

              <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Email</label>
              <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com"/>
              <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Senha</label>
              <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="••••••••"/>

              {modo==="login" && (
                <button onClick={entrar} disabled={loading} style={{width:"100%",background:ROSE,color:"#fff",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
                  {loading?"Entrando...":"Entrar"}
                </button>
              )}

              {modo==="cadastro" && (
                <>
                  <button onClick={assinar} style={{width:"100%",background:GOLD,color:"#2c1f1f",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",marginBottom:12}}>
                    ✓ Assinar — R$ 5.000/mês
                  </button>
                  <div style={{textAlign:"center",fontSize:11,color:"#ccc",margin:"8px 0",letterSpacing:1}}>JÁ PAGOU? CRIE SUA CONTA</div>
                  <button onClick={cadastrar} disabled={loading} style={{width:"100%",background:ROSE,color:"#fff",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
                    {loading?"Criando conta...":"Criar conta"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
