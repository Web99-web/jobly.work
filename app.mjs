import {allowance,calculate,parseMoney} from './salary-engine.mjs';
const data=JSON.parse(document.getElementById('salary-data').textContent);
const form=document.querySelector('#salary-form');
const money=c=>new Intl.NumberFormat('hr-HR',{style:'currency',currency:'EUR'}).format(c/100);
const pct=bp=>new Intl.NumberFormat('hr-HR',{maximumFractionDigits:2}).format(bp/100)+' %';
const by=id=>document.getElementById(id);
function number(id){const value=by(id).value;if(!/^\d+$/.test(value))throw new Error('Provjerite broj osoba i postotak korištenja olakšica.');return Number(value);}
function render(){
 try{
  const city=data.rates.find(c=>c.name===by('city').value.trim().toLocaleUpperCase('hr-HR'));
  if(!city)throw new Error('Odaberite grad ili općinu s ponuđenog popisa.');
  by('rate-note').textContent=`Niža stopa ${pct(city.lower)} · viša ${pct(city.upper)} · odluka NN ${city.decision}`;
  const manual=by('manual-toggle').checked;
  by('manual-field').hidden=!manual;
  by('auto-allowances').disabled=manual;
  const manualText=by('manual').value.trim();
  const personal=allowance({basic:by('basic').checked,children:number('children'),dependents:number('dependents'),disability:number('disability'),severeDisability:number('severe-disability'),share:number('share'),manual:manual?(/^0([,.]00?)?$/.test(manualText)?0:parseMoney(manualText)):null});
  const o={lower:city.lower,upper:city.upper,pension:by('pension').value,allowance:personal,areaRelief:by('area-relief').checked};
  const r=calculate(parseMoney(by('amount').value),by('mode').value,o);
  by('calc-error').hidden=true;by('results').hidden=false;
  for(const key of ['net','gross','gross2','totalDues'])by('result-'+key).textContent=money(r[key]);
  const names=[['Bruto 1 — ugovorena plaća','gross'],['Umanjenje osnovice za I. stup','reduction'],['Osnovica za I. stup','firstBase'],[`Mirovinsko I. stup (${o.pension==='both'?'15':'20'} %)`, 'first'],['Mirovinsko II. stup (5 %)','second'],['Mirovinski doprinosi ukupno','pension'],['Dohodak nakon mirovinskih doprinosa','income'],['Osobni odbitak prema odabiru','allowance'],['Iskorišteni osobni odbitak','usedAllowance'],['Porezna osnovica','taxBase'],[`Porez po nižoj stopi (${pct(o.lower)})`,'lowerTax'],[`Porez po višoj stopi (${pct(o.upper)})`,'upperTax'],['Umanjenje predujma poreza','relief'],['Porez na dohodak za uplatu','tax'],['Neto — radniku','net'],['Zdravstveno na teret poslodavca (16,5 %)','health'],['Bruto 2 — trošak poslodavca','gross2'],['Ukupan porez i doprinosi','totalDues']];
  by('breakdown-body').replaceChildren(...names.map(([label,key])=>{const tr=document.createElement('tr');if(['net','gross2','totalDues'].includes(key))tr.className='total';const a=document.createElement('td'),b=document.createElement('td');a.textContent=label;b.textContent=money(r[key]);tr.append(a,b);return tr;}));
  for(const [key,label] of [['net','Radnik'],['pension','Mirovinsko'],['tax','Porez'],['health','Zdravstveno']]){by('seg-'+key).style.width=(r[key]/r.gross2*100)+'%';by('legend-'+key).textContent=`${label} ${money(r[key])}`;}
  by('distribution').setAttribute('aria-label',`Od ukupnog troška ${money(r.gross2)} radnik prima ${money(r.net)}, mirovinski doprinosi iznose ${money(r.pension)}, porez ${money(r.tax)}, a zdravstveno ${money(r.health)}.`);
  const diff=r.net-data.median*100; data.month=data.month.replace(/\.$/,'');
  by('median-compare').textContent=diff===0?`Izračunata neto plaća jednaka je medijanu za ${data.month}.`:`Izračunata neto plaća je ${money(Math.abs(diff))} ${diff>0?'iznad':'ispod'} medijana za ${data.month}. Usporedba je s nacionalnom statistikom, a ne s vašim zanimanjem ili gradom.`;
  by('rounding-note').hidden=r.difference===0;
  by('rounding-note').textContent=`Zbog zaokruživanja na cente najbliži ostvarivi ${r.mode==='net'?'neto':'bruto 2'} iznosi ${money(r[r.mode==='net'?'net':'gross2'])}; odstupanje od unosa je ${money(Math.abs(r.difference))}.`;
  by('calculated-for').textContent=city.name.charAt(0)+city.name.slice(1).toLocaleLowerCase('hr-HR');
 }catch(e){by('calc-error').textContent=e.message;by('calc-error').hidden=false;by('results').hidden=true;}
}
if(form){by('calculate').disabled=false;by('calculate').addEventListener('click',render);form.addEventListener('submit',e=>{e.preventDefault();render();});form.addEventListener('change',render);form.addEventListener('input',e=>{if(e.target.id!=='city')render();});render();}
