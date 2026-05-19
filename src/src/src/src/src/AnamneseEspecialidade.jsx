import React, { useState } from "react";

const ROSE = "#B08B8C";
const GOLD = "#CCA968";

const inputStyle = {
  width:"100%", border:"1px solid #e8e0e0", borderRadius:4,
  padding:"10px 12px", fontFamily:"'Montserrat',sans-serif",
  fontSize:12, outline:"none", marginBottom:12,
  boxSizing:"border-box", color:"#333"
};

const selectStyle = { ...inputStyle, background:"#fff" };

const labelStyle = {
  fontSize:10, fontWeight:700, color:"#888",
  letterSpacing:1, textTransform:"uppercase",
  display:"block", marginBottom:4
};

const gridStyle = {
  display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px"
};

const alertStyle = {
  background:"#fff8e1", border:"1px solid #CCA968",
  borderRadius:6, padding:"10px 14px", fontSize:11,
  color:"#7a5c00", marginBottom:12, lineHeight:1.6
};

const dangerStyle = {
  background:"#fdecea", border:"1px solid #e74c3c",
  borderRadius:6, padding:"10px 14px", fontSize:11,
  color:"#c0392b", marginBottom:12, lineHeight:1.6
};

// Calcula dose pediátrica por peso
const calcDosePed = (dose_mg_kg, peso) => {
  if (!peso || !dose_mg_kg) return null;
  return (dose_mg_kg * peso).toFixed(1);
};

// Calcula TFG estimada (CKD-EPI simplificado)
const calcTFG = (creatinina, idade, sexo) => {
  if (!creatinina || !idade) return null;
  const k = sexo === "F" ? 0.7 : 0.9;
  const a = sexo === "F" ? -0.329 : -0.411;
  const cr = parseFloat(creatinina) / k;
  const tfg = 141 * Math.pow(Math.min(cr, 1), a) * Math.pow(Math.max(cr, 1), -1.209) * Math.pow(0.993, parseInt(idade)) * (sexo === "F" ? 1.018 : 1);
  return Math.round(tfg);
};

function Campo({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontSize:11,fontWeight:700,color:ROSE,letterSpacing:2,textTransform:"uppercase",borderBottom:`1px solid ${ROSE}20`,paddingBottom:6,marginBottom:14}}>{titulo}</div>
      {children}
    </div>
  );
}

// =================== FORMULÁRIOS POR ESPECIALIDADE ===================

function FormPsiquiatria({ dados, onChange }) {
  return (
    <>
      <Secao titulo="Dados do Paciente">
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" placeholder="anos" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </Campo>
        </div>
        <Campo label="Gestante ou amamentando?">
          <select style={selectStyle} value={dados.gestante||""} onChange={e=>onChange("gestante",e.target.value)}>
            <option value="">Não</option>
            <option>Gestante</option>
            <option>Amamentando</option>
          </select>
        </Campo>
        {dados.gestante && dados.gestante !== "" && (
          <div style={dangerStyle}>⚠️ ATENÇÃO: Paciente {dados.gestante}. Evitar: benzodiazepínicos, valproato, carbamazepina, lítio no 1º trimestre. Preferir: sertralina, escitalopram com monitorização.</div>
        )}
      </Secao>
      <Secao titulo="História Psiquiátrica">
        <Campo label="Medicamentos psiquiátricos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="ex: sertralina 100mg, clonazepam 2mg..." value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Medicamentos que já usou e falharam">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="ex: fluoxetina — sem resposta, paroxetina — intolerância..." value={dados.meds_falha||""} onChange={e=>onChange("meds_falha",e.target.value)}/>
        </Campo>
        <div style={gridStyle}>
          <Campo label="Tentativas de suicídio prévias">
            <select style={selectStyle} value={dados.ts_previa||""} onChange={e=>onChange("ts_previa",e.target.value)}>
              <option value="">Não</option>
              <option>Sim — 1 vez</option>
              <option>Sim — múltiplas</option>
            </select>
          </Campo>
          <Campo label="Uso de álcool/substâncias">
            <select style={selectStyle} value={dados.substancias||""} onChange={e=>onChange("substancias",e.target.value)}>
              <option value="">Não</option>
              <option>Álcool</option>
              <option>Cannabis</option>
              <option>Múltiplas</option>
            </select>
          </Campo>
        </div>
        <Campo label="Comorbidades clínicas relevantes">
          <input style={inputStyle} placeholder="ex: hipotireoidismo, diabetes, HAS..." value={dados.comorbidades||""} onChange={e=>onChange("comorbidades",e.target.value)}/>
        </Campo>
        <Campo label="Alergias medicamentosas">
          <input style={inputStyle} placeholder="ex: alergia a penicilina, dipirona..." value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormPediatria({ dados, onChange }) {
  const peso = parseFloat(dados.peso);
  const imcVal = peso && dados.altura ? (peso / Math.pow(parseFloat(dados.altura)/100, 2)).toFixed(1) : null;

  return (
    <>
      {dados.gestante_mae && (
        <div style={dangerStyle}>⚠️ Mãe amamentando — evitar: metronidazol, tetraciclinas, cloranfenicol, aspirina, ergotamina, lítio.</div>
      )}
      <Secao titulo="Dados Antropométricos — OBRIGATÓRIO para dose">
        <div style={gridStyle}>
          <Campo label="Peso (kg)"><input style={inputStyle} type="number" step="0.1" placeholder="ex: 12.5" value={dados.peso||""} onChange={e=>onChange("peso",e.target.value)}/></Campo>
          <Campo label="Altura (cm)"><input style={inputStyle} type="number" placeholder="ex: 90" value={dados.altura||""} onChange={e=>onChange("altura",e.target.value)}/></Campo>
        </div>
        <div style={gridStyle}>
          <Campo label="Idade">
            <input style={inputStyle} placeholder="ex: 2 anos e 3 meses" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/>
          </Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option>Masculino</option>
              <option>Feminino</option>
            </select>
          </Campo>
        </div>
        {peso && dados.altura && (
          <div style={{...alertStyle, background:"#e8f5e9", borderColor:"#4caf50", color:"#2e7d32"}}>
            ✓ IMC: {imcVal} kg/m² · Peso para cálculo de doses: <strong>{peso} kg</strong>
          </div>
        )}
      </Secao>
      <Secao titulo="Dados Clínicos">
        <div style={gridStyle}>
          <Campo label="Aleitamento materno">
            <select style={selectStyle} value={dados.aleitamento||""} onChange={e=>onChange("aleitamento",e.target.value)}>
              <option value="">Não</option>
              <option>Sim — exclusivo</option>
              <option>Sim — misto</option>
            </select>
          </Campo>
          <Campo label="Prematuro?">
            <select style={selectStyle} value={dados.prematuro||""} onChange={e=>onChange("prematuro",e.target.value)}>
              <option value="">Não</option>
              <option>Sim — 34-36 sem</option>
              <option>Sim — &lt;34 sem</option>
            </select>
          </Campo>
        </div>
        <Campo label="Vacinas em dia?">
          <select style={selectStyle} value={dados.vacinas||""} onChange={e=>onChange("vacinas",e.target.value)}>
            <option value="">Sim</option>
            <option>Não — atraso no calendário</option>
            <option>Parcialmente</option>
          </select>
        </Campo>
        <Campo label="Alergias medicamentosas">
          <input style={inputStyle} placeholder="ex: amoxicilina — urticária" value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
        <Campo label="Medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="Nome, dose e frequência" value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Comorbidades">
          <input style={inputStyle} placeholder="ex: cardiopatia congênita, imunodeficiência..." value={dados.comorbidades||""} onChange={e=>onChange("comorbidades",e.target.value)}/>
        </Campo>
      </Secao>
      {peso && (
        <div style={alertStyle}>
          💊 <strong>Referência de doses pelo peso ({peso}kg):</strong><br/>
          Paracetamol: {calcDosePed(15, peso)}mg (15mg/kg) a cada 6h<br/>
          Ibuprofeno: {calcDosePed(10, peso)}mg (10mg/kg) a cada 8h<br/>
          Amoxicilina: {calcDosePed(50, peso)}mg/dia (50mg/kg/dia) ÷ 3x<br/>
          Azitromicina: {calcDosePed(10, peso)}mg/dia (10mg/kg/dia) 1x/dia
        </div>
      )}
    </>
  );
}

function FormNeurologia({ dados, onChange }) {
  const tfg = calcTFG(dados.creatinina, dados.idade, dados.sexo);

  return (
    <>
      <Secao titulo="Dados do Paciente">
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" placeholder="anos" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </Campo>
        </div>
      </Secao>
      <Secao titulo="⚠️ Alertas Críticos — Preencher com Atenção">
        <Campo label="Anticoagulado? (CRÍTICO para AVC)">
          <select style={selectStyle} value={dados.anticoagulado||""} onChange={e=>onChange("anticoagulado",e.target.value)}>
            <option value="">Não</option>
            <option>Warfarina</option>
            <option>Rivaroxabana</option>
            <option>Apixabana</option>
            <option>Dabigatrana</option>
            <option>Heparina</option>
          </select>
        </Campo>
        {dados.anticoagulado && dados.anticoagulado !== "" && (
          <div style={dangerStyle}>⚠️ ANTICOAGULADO: Trombólise CONTRAINDICADA. Checar INR antes de qualquer procedimento. Reversor disponível?</div>
        )}
        <Campo label="Antiepilépticos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="ex: fenitoína 300mg, carbamazepina 400mg, ácido valproico 1000mg..." value={dados.antiepileticos||""} onChange={e=>onChange("antiepileticos",e.target.value)}/>
        </Campo>
        {dados.antiepileticos && (
          <div style={alertStyle}>
            ⚠️ INTERAÇÕES ANTIEPILÉPTICOS: Carbamazepina/Fenitoína induzem CYP3A4 — reduzem nível de: contraceptivos, varfarina, corticoides, antifúngicos. Valproato inibe metabolismo — aumenta nível de lamotrigina (risco Stevens-Johnson).
          </div>
        )}
        <div style={gridStyle}>
          <Campo label="Capacidade de deglutição">
            <select style={selectStyle} value={dados.degluticao||""} onChange={e=>onChange("degluticao",e.target.value)}>
              <option value="">Normal</option>
              <option>Disfagia leve</option>
              <option>Disfagia grave — SNG</option>
              <option>Via oral impossível</option>
            </select>
          </Campo>
          <Campo label="Creatinina (mg/dL)">
            <input style={inputStyle} type="number" step="0.1" placeholder="ex: 1.2" value={dados.creatinina||""} onChange={e=>onChange("creatinina",e.target.value)}/>
          </Campo>
        </div>
        {tfg && (
          <div style={tfg < 30 ? dangerStyle : tfg < 60 ? alertStyle : {...alertStyle, background:"#e8f5e9", borderColor:"#4caf50", color:"#2e7d32"}}>
            TFG estimada: <strong>{tfg} mL/min/1,73m²</strong> {tfg < 30 ? "— INSUFICIÊNCIA RENAL GRAVE: ajustar doses de gabapentina, pregabalina, levetiracetam" : tfg < 60 ? "— Insuficiência renal moderada: atenção às doses" : "— Função renal normal"}
          </div>
        )}
        <Campo label="Outros medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="Liste TODOS — interações neurológicas são graves" value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Gestante?">
          <select style={selectStyle} value={dados.gestante||""} onChange={e=>onChange("gestante",e.target.value)}>
            <option value="">Não</option>
            <option>Sim — 1º trimestre</option>
            <option>Sim — 2º trimestre</option>
            <option>Sim — 3º trimestre</option>
          </select>
        </Campo>
        {dados.gestante && dados.gestante !== "" && (
          <div style={dangerStyle}>⚠️ GESTANTE: Valproato CONTRAINDICADO (teratogênico, risco 10x malformações). Fenitoína CONTRAINDICADA. Preferir: lamotrigina (dose estável monitorada), levetiracetam. Usar folato 5mg/dia.</div>
        )}
      </Secao>
      <Secao titulo="Quadro Neurológico">
        <Campo label="Urgência neurológica?">
          <select style={selectStyle} value={dados.urgencia||""} onChange={e=>onChange("urgencia",e.target.value)}>
            <option value="">Não — consulta eletiva</option>
            <option>AVC — tempo de início dos sintomas?</option>
            <option>Crise epiléptica ativa</option>
            <option>Meningite suspeita</option>
            <option>TCE recente</option>
          </select>
        </Campo>
        {dados.urgencia && dados.urgencia.includes("AVC") && (
          <div style={dangerStyle}>🚨 PROTOCOLO AVC: Tempo é cérebro! rt-PA até 4,5h do início. Trombectomia até 24h se elegível (DAWN/DEFUSE-3). PA &lt;185/110 para trombolítico. Glicemia 140-180mg/dL.</div>
        )}
        <Campo label="Alergias">
          <input style={inputStyle} placeholder="medicamentos, contraste..." value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormCardiologia({ dados, onChange }) {
  const tfg = calcTFG(dados.creatinina, dados.idade, dados.sexo);

  return (
    <>
      <Secao titulo="Dados Vitais — ESSENCIAIS">
        <div style={gridStyle}>
          <Campo label="PA sistólica (mmHg)"><input style={inputStyle} type="number" placeholder="ex: 140" value={dados.pas||""} onChange={e=>onChange("pas",e.target.value)}/></Campo>
          <Campo label="PA diastólica (mmHg)"><input style={inputStyle} type="number" placeholder="ex: 90" value={dados.pad||""} onChange={e=>onChange("pad",e.target.value)}/></Campo>
        </div>
        <div style={gridStyle}>
          <Campo label="FC (bpm)"><input style={inputStyle} type="number" placeholder="ex: 72" value={dados.fc||""} onChange={e=>onChange("fc",e.target.value)}/></Campo>
          <Campo label="Peso (kg)"><input style={inputStyle} type="number" step="0.1" placeholder="ex: 75" value={dados.peso||""} onChange={e=>onChange("peso",e.target.value)}/></Campo>
        </div>
        {dados.pas && parseInt(dados.pas) >= 180 && (
          <div style={dangerStyle}>🚨 EMERGÊNCIA HIPERTENSIVA: PA ≥180mmHg. Avaliar lesão em órgão-alvo. Reduzir PA 25% em 1h com anti-hipertensivo IV.</div>
        )}
      </Secao>
      <Secao titulo="⚠️ Dados Críticos">
        <div style={gridStyle}>
          <Campo label="Creatinina (mg/dL)"><input style={inputStyle} type="number" step="0.1" placeholder="ex: 1.2" value={dados.creatinina||""} onChange={e=>onChange("creatinina",e.target.value)}/></Campo>
          <Campo label="Idade"><input style={inputStyle} type="number" placeholder="anos" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
        </div>
        <Campo label="Sexo">
          <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </Campo>
        {tfg && (
          <div style={tfg < 30 ? dangerStyle : tfg < 60 ? alertStyle : {...alertStyle, background:"#e8f5e9", borderColor:"#4caf50", color:"#2e7d32"}}>
            TFG estimada: <strong>{tfg} mL/min/1,73m²</strong>
            {tfg < 30 && " — IECA/BRA com cautela extrema. Espironolactona CONTRAINDICADA. Metformina CONTRAINDICADA."}
            {tfg >= 30 && tfg < 60 && " — Reduzir doses de IECA/BRA. Monitorar K+. Metformina 50% da dose."}
            {tfg >= 60 && " — Função renal preservada."}
          </div>
        )}
        <Campo label="Anticoagulado?">
          <select style={selectStyle} value={dados.anticoagulado||""} onChange={e=>onChange("anticoagulado",e.target.value)}>
            <option value="">Não</option>
            <option>Warfarina</option>
            <option>Rivaroxabana</option>
            <option>Apixabana</option>
            <option>Dabigatrana</option>
            <option>AAS</option>
            <option>AAS + Clopidogrel</option>
          </select>
        </Campo>
        {dados.anticoagulado && dados.anticoagulado !== "" && (
          <div style={alertStyle}>⚠️ Anticoagulado com {dados.anticoagulado}. Evitar AINEs. Se warfarina: checar INR antes de procedimentos.</div>
        )}
        <Campo label="Fração de ejeção (%)">
          <input style={inputStyle} type="number" placeholder="ex: 35 (se conhecida)" value={dados.fe||""} onChange={e=>onChange("fe",e.target.value)}/>
        </Campo>
        {dados.fe && parseInt(dados.fe) < 40 && (
          <div style={dangerStyle}>⚠️ IC com FE reduzida (&lt;40%): Pilar do tratamento — IECA/BRA + betabloqueador + MRA + SGLT2. Evitar: AINEs, verapamil, diltiazem, antiarrítmicos classe I.</div>
        )}
        <Campo label="Marca-passo ou CDI?">
          <select style={selectStyle} value={dados.marcapasso||""} onChange={e=>onChange("marcapasso",e.target.value)}>
            <option value="">Não</option>
            <option>Marca-passo</option>
            <option>CDI</option>
            <option>TRC</option>
          </select>
        </Campo>
        <Campo label="Medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="Liste todos os cardiovasculares em uso" value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Alergias (especialmente AAS, contraste, estatinas)">
          <input style={inputStyle} placeholder="ex: AAS — broncoespasmo" value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormEndocrinologia({ dados, onChange }) {
  const tfg = calcTFG(dados.creatinina, dados.idade, dados.sexo);
  const imcVal = dados.peso && dados.altura ? (parseFloat(dados.peso) / Math.pow(parseFloat(dados.altura)/100, 2)).toFixed(1) : null;

  return (
    <>
      <Secao titulo="Dados Antropométricos">
        <div style={gridStyle}>
          <Campo label="Peso (kg)"><input style={inputStyle} type="number" step="0.1" placeholder="ex: 85" value={dados.peso||""} onChange={e=>onChange("peso",e.target.value)}/></Campo>
          <Campo label="Altura (cm)"><input style={inputStyle} type="number" placeholder="ex: 170" value={dados.altura||""} onChange={e=>onChange("altura",e.target.value)}/></Campo>
        </div>
        {imcVal && (
          <div style={parseFloat(imcVal) >= 30 ? alertStyle : {...alertStyle, background:"#e8f5e9", borderColor:"#4caf50", color:"#2e7d32"}}>
            IMC: <strong>{imcVal} kg/m²</strong> — {parseFloat(imcVal) < 18.5 ? "Baixo peso" : parseFloat(imcVal) < 25 ? "Normal" : parseFloat(imcVal) < 30 ? "Sobrepeso" : parseFloat(imcVal) < 35 ? "Obesidade grau I" : parseFloat(imcVal) < 40 ? "Obesidade grau II" : "Obesidade grau III"}
          </div>
        )}
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </Campo>
        </div>
      </Secao>
      <Secao titulo="Dados Metabólicos">
        <div style={gridStyle}>
          <Campo label="Glicemia atual (mg/dL)"><input style={inputStyle} type="number" placeholder="ex: 180" value={dados.glicemia||""} onChange={e=>onChange("glicemia",e.target.value)}/></Campo>
          <Campo label="HbA1c (%)"><input style={inputStyle} type="number" step="0.1" placeholder="ex: 8.5" value={dados.hba1c||""} onChange={e=>onChange("hba1c",e.target.value)}/></Campo>
        </div>
        {dados.glicemia && parseInt(dados.glicemia) > 400 && (
          <div style={dangerStyle}>🚨 Glicemia muito elevada. Investigar cetoacidose (DM1) ou estado hiperosmolar (DM2). Hidratação IV e insulina urgente.</div>
        )}
        <Campo label="Creatinina (mg/dL)">
          <input style={inputStyle} type="number" step="0.1" placeholder="ex: 1.0" value={dados.creatinina||""} onChange={e=>onChange("creatinina",e.target.value)}/>
        </Campo>
        {tfg && (
          <div style={tfg < 30 ? dangerStyle : tfg < 45 ? alertStyle : {...alertStyle, background:"#e8f5e9", borderColor:"#4caf50", color:"#2e7d32"}}>
            TFG: <strong>{tfg} mL/min/1,73m²</strong>
            {tfg < 30 && " — Metformina CONTRAINDICADA. SGLT2 sem eficácia hipoglicemiante. Ajustar insulina."}
            {tfg >= 30 && tfg < 45 && " — Metformina CONTRAINDICADA (&lt;45). Canagliflozina CONTRAINDICADA. Preferir GLP-1 ou insulina."}
            {tfg >= 45 && tfg < 60 && " — Metformina com cautela, reduzir dose. Monitorar acidose lática."}
            {tfg >= 60 && " — Função renal preservada. Metformina e SGLT2 permitidos."}
          </div>
        )}
        <Campo label="Gestante?">
          <select style={selectStyle} value={dados.gestante||""} onChange={e=>onChange("gestante",e.target.value)}>
            <option value="">Não</option>
            <option>Sim — DM gestacional</option>
            <option>Sim — DM1 pré-gestacional</option>
            <option>Sim — DM2 pré-gestacional</option>
          </select>
        </Campo>
        {dados.gestante && dados.gestante !== "" && (
          <div style={dangerStyle}>⚠️ GESTANTE DIABÉTICA: Metformina — uso off-label permitido. SGLT2 CONTRAINDICADO. GLP-1 CONTRAINDICADO. Insulina é o padrão-ouro. Meta HbA1c &lt;6,5%.</div>
        )}
        <Campo label="TSH atual (mUI/L)">
          <input style={inputStyle} type="number" step="0.01" placeholder="ex: 4.5" value={dados.tsh||""} onChange={e=>onChange("tsh",e.target.value)}/>
        </Campo>
        {dados.tsh && parseFloat(dados.tsh) > 10 && (
          <div style={alertStyle}>⚠️ Hipotireoidismo primário (TSH &gt;10). Iniciar levotiroxina. Dose inicial: 1,6 mcg/kg/dia. Em idosos e cardiopatas: iniciar 25-50 mcg/dia.</div>
        )}
        <Campo label="Medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="Incluir insulinas e anti-diabéticos orais com doses" value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Alergias">
          <input style={inputStyle} value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormGinecologia({ dados, onChange }) {
  return (
    <>
      <Secao titulo="Dados da Paciente">
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="DUM (última menstruação)"><input style={inputStyle} type="date" value={dados.dum||""} onChange={e=>onChange("dum",e.target.value)}/></Campo>
        </div>
        <Campo label="Status reprodutivo">
          <select style={selectStyle} value={dados.status_reprod||""} onChange={e=>onChange("status_reprod",e.target.value)}>
            <option value="">Selecione</option>
            <option>Menacme</option>
            <option>Gestante</option>
            <option>Puerpério — amamentando</option>
            <option>Puerpério — não amamentando</option>
            <option>Perimenopausa</option>
            <option>Menopausa confirmada</option>
          </select>
        </Campo>
        {dados.status_reprod === "Gestante" && (
          <div style={dangerStyle}>⚠️ GESTANTE: Contraindicados — misoprostol (exceto sob supervisão), isotretinoína, metotrexato, DIU, anticontraceptivos hormonais combinados. Progesterona natural é segura.</div>
        )}
        {dados.status_reprod && dados.status_reprod.includes("amamentando") && (
          <div style={alertStyle}>⚠️ AMAMENTANDO: Evitar — bromocriptina, cabergolina, estrogenoterapia combinada. Preferir: progestogênio isolado, DIU levonorgestrel.</div>
        )}
      </Secao>
      <Secao titulo="Histórico Ginecológico">
        <Campo label="Anticoncepção atual">
          <select style={selectStyle} value={dados.anticoncepcao||""} onChange={e=>onChange("anticoncepcao",e.target.value)}>
            <option value="">Nenhuma</option>
            <option>ACO combinado</option>
            <option>Minipílula (progestogênio)</option>
            <option>DIU cobre</option>
            <option>DIU hormonal (Mirena)</option>
            <option>Implante subdérmico</option>
            <option>Injetável mensal</option>
            <option>Injetável trimestral</option>
            <option>Preservativo</option>
            <option>Laqueadura</option>
          </select>
        </Campo>
        <div style={gridStyle}>
          <Campo label="Cirurgias ginecológicas prévias">
            <select style={selectStyle} value={dados.cirurgia||""} onChange={e=>onChange("cirurgia",e.target.value)}>
              <option value="">Nenhuma</option>
              <option>Histerectomia total</option>
              <option>Histerectomia + ooforectomia bilateral</option>
              <option>Miomectomia</option>
              <option>Cirurgia endometriose</option>
              <option>Outra</option>
            </select>
          </Campo>
          <Campo label="Papanicolau recente?">
            <select style={selectStyle} value={dados.papa||""} onChange={e=>onChange("papa",e.target.value)}>
              <option value="">Sim — normal</option>
              <option>Sim — alterado</option>
              <option>Não fez/atrasado</option>
            </select>
          </Campo>
        </div>
        <Campo label="Medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Alergias">
          <input style={inputStyle} value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
        <Campo label="Comorbidades">
          <input style={inputStyle} placeholder="ex: SOP, endometriose, miomatose, HAS, DM..." value={dados.comorbidades||""} onChange={e=>onChange("comorbidades",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormDermatologia({ dados, onChange }) {
  return (
    <>
      <Secao titulo="Dados do Paciente">
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option>Masculino</option>
              <option>Feminino</option>
            </select>
          </Campo>
        </div>
        <Campo label="Fotótipo (Fitzpatrick) — ESSENCIAL">
          <select style={selectStyle} value={dados.fototipo||""} onChange={e=>onChange("fototipo",e.target.value)}>
            <option value="">Selecione</option>
            <option>I — Sempre queima, nunca bronzeia (pele muito clara)</option>
            <option>II — Sempre queima, raramente bronzeia</option>
            <option>III — Às vezes queima, bronzeia gradualmente</option>
            <option>IV — Raramente queima, sempre bronzeia (pele morena)</option>
            <option>V — Muito raramente queima (pele morena escura)</option>
            <option>VI — Nunca queima (pele negra)</option>
          </select>
        </Campo>
      </Secao>
      <Secao titulo="⚠️ Alertas Críticos">
        <Campo label="Gestante ou amamentando?">
          <select style={selectStyle} value={dados.gestante||""} onChange={e=>onChange("gestante",e.target.value)}>
            <option value="">Não</option>
            <option>Gestante</option>
            <option>Amamentando</option>
            <option>Planejando engravidar</option>
          </select>
        </Campo>
        {dados.gestante && dados.gestante !== "" && (
          <div style={dangerStyle}>⚠️ {dados.gestante}: Isotretinoína ABSOLUTAMENTE CONTRAINDICADA (teratogênica). Retinoides tópicos CONTRAINDICADOS. Tacrolimo/pimecrolimo — evitar. Corticoides tópicos potentes — evitar extenso. Permitidos: emolientes, corticoide leve localizado, anti-histamínico loratadina.</div>
        )}
        <Campo label="Imunossuprimido?">
          <select style={selectStyle} value={dados.imunosuprimo||""} onChange={e=>onChange("imunosuprimo",e.target.value)}>
            <option value="">Não</option>
            <option>HIV/AIDS</option>
            <option>Transplantado</option>
            <option>Corticoide sistêmico</option>
            <option>Imunobiológico</option>
            <option>Quimioterapia</option>
          </select>
        </Campo>
        {dados.imunosuprimo && dados.imunosuprimo !== "" && (
          <div style={alertStyle}>⚠️ IMUNOSSUPRIMIDO: Atenção a infecções oportunistas (herpes, candidíase, escabiose crostosa). Biológicos para psoríase — checar TB latente antes. Dermatoses por reativação viral são mais graves.</div>
        )}
        <Campo label="% da superfície corporal afetada (BSA)">
          <select style={selectStyle} value={dados.bsa||""} onChange={e=>onChange("bsa",e.target.value)}>
            <option value="">Selecione</option>
            <option>&lt;3% — leve</option>
            <option>3-10% — moderado</option>
            <option>&gt;10% — grave</option>
          </select>
        </Campo>
        {dados.bsa === ">10% — grave" && (
          <div style={alertStyle}>⚠️ BSA &gt;10%: Considerar tratamento sistêmico ou biológico. Corticoide tópico em grande área pode causar supressão adrenal.</div>
        )}
        <Campo label="Uso de corticoide tópico (tempo)">
          <select style={selectStyle} value={dados.corticopico||""} onChange={e=>onChange("corticopico",e.target.value)}>
            <option value="">Não usa</option>
            <option>Uso recente (&lt;2 semanas)</option>
            <option>Uso prolongado (2-4 semanas)</option>
            <option>Uso crônico (&gt;1 mês)</option>
          </select>
        </Campo>
        {dados.corticopico === "Uso crônico (>1 mês)" && (
          <div style={alertStyle}>⚠️ Uso crônico de corticoide tópico: Risco de atrofia cutânea, telangectasias, dermatite perioral, rosácea esteroidal. Considerar retirada gradual.</div>
        )}
        <Campo label="Medicamentos em uso (sistêmicos)">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="Incluir todos — muitos causam reações cutâneas" value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Alergias">
          <input style={inputStyle} value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

function FormClinicaGeral({ dados, onChange }) {
  return (
    <>
      <Secao titulo="Dados do Paciente">
        <div style={gridStyle}>
          <Campo label="Idade"><input style={inputStyle} type="number" value={dados.idade||""} onChange={e=>onChange("idade",e.target.value)}/></Campo>
          <Campo label="Sexo">
            <select style={selectStyle} value={dados.sexo||""} onChange={e=>onChange("sexo",e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </Campo>
        </div>
        <div style={gridStyle}>
          <Campo label="Peso (kg)"><input style={inputStyle} type="number" step="0.1" value={dados.peso||""} onChange={e=>onChange("peso",e.target.value)}/></Campo>
          <Campo label="Altura (cm)"><input style={inputStyle} type="number" value={dados.altura||""} onChange={e=>onChange("altura",e.target.value)}/></Campo>
        </div>
        <Campo label="Gestante ou amamentando?">
          <select style={selectStyle} value={dados.gestante||""} onChange={e=>onChange("gestante",e.target.value)}>
            <option value="">Não</option>
            <option>Gestante</option>
            <option>Amamentando</option>
          </select>
        </Campo>
      </Secao>
      <Secao titulo="Histórico">
        <Campo label="Comorbidades">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} placeholder="HAS, DM, hipotireoidismo, dislipidemia..." value={dados.comorbidades||""} onChange={e=>onChange("comorbidades",e.target.value)}/>
        </Campo>
        <Campo label="Medicamentos em uso">
          <textarea style={{...inputStyle,minHeight:60,resize:"vertical"}} value={dados.meds_uso||""} onChange={e=>onChange("meds_uso",e.target.value)}/>
        </Campo>
        <Campo label="Alergias">
          <input style={inputStyle} value={dados.alergias||""} onChange={e=>onChange("alergias",e.target.value)}/>
        </Campo>
      </Secao>
    </>
  );
}

// =================== COMPONENTE PRINCIPAL ===================

const FORMS = {
  psiquiatria: FormPsiquiatria,
  neurologia: FormNeurologia,
  cardiologia: FormCardiologia,
  endocrinologia: FormEndocrinologia,
  ginecologia: FormGinecologia,
  pediatria: FormPediatria,
  dermatologia: FormDermatologia,
  clinica_geral: FormClinicaGeral,
};

export default function AnamneseEspecialidade({ especialidade, onConfirm, onCancel }) {
  const [dados, setDados] = useState({});

  const onChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const FormComponent = FORMS[especialidade] || FormClinicaGeral;

  const gerarResumo = () => {
    const partes = [];
    if (dados.idade) partes.push(`${dados.idade} anos`);
    if (dados.sexo) partes.push(dados.sexo);
    if (dados.peso) partes.push(`${dados.peso}kg`);
    if (dados.altura) partes.push(`${dados.altura}cm`);
    if (dados.gestante && dados.gestante !== "") partes.push(dados.gestante);
    if (dados.alergias) partes.push(`Alergias: ${dados.alergias}`);
    if (dados.meds_uso) partes.push(`Em uso: ${dados.meds_uso}`);
    if (dados.comorbidades) partes.push(`Comorbidades: ${dados.comorbidades}`);
    if (dados.meds_falha) partes.push(`Falha prévia: ${dados.meds_falha}`);
    if (dados.anticoagulado && dados.anticoagulado !== "") partes.push(`Anticoagulado: ${dados.anticoagulado}`);
    if (dados.pas && dados.pad) partes.push(`PA: ${dados.pas}x${dados.pad}mmHg`);
    if (dados.fc) partes.push(`FC: ${dados.fc}bpm`);
    if (dados.glicemia) partes.push(`Glicemia: ${dados.glicemia}mg/dL`);
    if (dados.hba1c) partes.push(`HbA1c: ${dados.hba1c}%`);
    if (dados.tsh) partes.push(`TSH: ${dados.tsh}mUI/L`);
    if (dados.fototipo) partes.push(`Fotótipo: ${dados.fototipo}`);
    if (dados.antiepileticos) partes.push(`Antiepilépticos: ${dados.antiepileticos}`);
    if (dados.fe) partes.push(`FE: ${dados.fe}%`);
    if (dados.dum) partes.push(`DUM: ${dados.dum}`);
    if (dados.status_reprod) partes.push(dados.status_reprod);
    return partes.join(" | ");
  };

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:"#fff",borderRadius:12,maxWidth:560,width:"100%",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>

        {/* Header */}
        <div style={{background:ROSE,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#fff",letterSpacing:2,textTransform:"uppercase"}}>Dados do Paciente</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.8)",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{especialidade?.toUpperCase()}</div>
          </div>
          <button onClick={onCancel} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.7)",fontSize:18,cursor:"pointer"}}>✕</button>
        </div>

        {/* Body */}
        <div style={{padding:24,overflowY:"auto",flex:1}}>
          <p style={{fontSize:12,color:"#888",marginBottom:20,lineHeight:1.6}}>
            Preencha os dados clínicos relevantes. As informações serão usadas para personalizar a conduta, doses e alertas de segurança.
          </p>
          <FormComponent dados={dados} onChange={onChange}/>
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid #f0eded",flexShrink:0,background:"#fafafa"}}>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onCancel} style={{flex:1,padding:"12px",border:`1px solid ${ROSE}`,background:"transparent",color:ROSE,borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Cancelar</button>
            <button onClick={()=>onConfirm(dados, gerarResumo())} style={{flex:2,padding:"12px",border:"none",background:ROSE,color:"#fff",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Gerar Documentos ⚡</button>
          </div>
        </div>
      </div>
    </div>
  );
}
