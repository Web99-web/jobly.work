// All money is integer EUR cents. Rates are integer basis points; no float-money arithmetic.
export const RULES = Object.freeze({year:2026,basic:60000,threshold:500000,minGross:105000,maxGross:1195800,health:1650});
export const roundRatio=(n,d)=>Math.floor((n+Math.floor(d/2))/d);
export function parseMoney(value){
  let s=String(value).trim().replace(/[\s\u00a0€]/g,'');
  if(s.includes(',')){s=s.replace(/\./g,'').replace(',','.');}
  if(!/^\d+(\.\d{1,2})?$/.test(s))throw new Error('Upišite pozitivan iznos s najviše dvije decimale, npr. 1.500,00.');
  const [e,c='']=s.split('.');const result=Number(e)*100+Number(c.padEnd(2,'0'));
  if(!Number.isSafeInteger(result)||result<=0||result>2000000)throw new Error('Upišite iznos veći od 0 i najviše 20.000 €.');
  return result;
}
function count(x,max=20){if(!Number.isInteger(x)||x<0||x>max)throw new Error('Provjerite broj uzdržavanih osoba ili olakšica.');return x;}
export function allowance({basic=true,children=0,dependents=0,disability=0,severeDisability=0,share=100,manual=null}={}){
  if(manual!==null){if(!Number.isInteger(manual)||manual<0||manual>10000000)throw new Error('Provjerite mjesečni osobni odbitak s porezne kartice.');return manual;}
  count(children,9);count(dependents);count(disability);count(severeDisability);
  if(!Number.isInteger(share)||share<0||share>100)throw new Error('Udio olakšica mora biti između 0 i 100 %.');
  if(disability+severeDisability>1+children+dependents)throw new Error('Broj osoba s invaliditetom ne može biti veći od ukupnog broja osoba. Istu osobu nemojte brojiti u obje skupine.');
  const childCents=[30000,42000,60000,84000,114000,150000,192000,240000,294000];
  return (basic?RULES.basic:0)+roundRatio((childCents.slice(0,children).reduce((a,b)=>a+b,0)+dependents*30000+disability*18000+severeDisability*60000)*share,100);
}
export function validateOptions(o){
  if(!Number.isInteger(o.lower)||!Number.isInteger(o.upper)||o.lower<1500||o.lower>2300||o.upper<2500||o.upper>3300)throw new Error('Odaberite grad ili općinu iz službenog popisa.');
  if(!['both','first'].includes(o.pension))throw new Error('Odaberite mirovinsko osiguranje.');
  if(!Number.isInteger(o.allowance)||o.allowance<0||o.allowance>10000000)throw new Error('Provjerite osobni odbitak.');
}
export function fromGross(g,o){
  validateOptions(o);
  if(!Number.isInteger(g)||g<RULES.minGross||g>RULES.maxGross)throw new Error('Ovaj obračun podržava redovnu mjesečnu bruto 1 plaću od 1.050 € do 11.958 €. Za drugačiju osnovicu potreban je poseban obračun.');
  const reduction=g<=70000?Math.min(g,30000):g<130000?roundRatio(130000-g,2):0;
  const firstBase=g-reduction;
  const first=roundRatio(firstBase*(o.pension==='both'?1500:2000),10000);
  const second=o.pension==='both'?roundRatio(g*500,10000):0;
  const pension=first+second,income=g-pension,taxBase=Math.max(0,income-o.allowance);
  const lowerBase=Math.min(taxBase,RULES.threshold),upperBase=Math.max(0,taxBase-RULES.threshold);
  const lowerTax=roundRatio(lowerBase*o.lower,10000),upperTax=roundRatio(upperBase*o.upper,10000);
  const beforeRelief=lowerTax+upperTax;
  const tax=o.areaRelief?roundRatio(beforeRelief,2):beforeRelief;
  const relief=beforeRelief-tax,net=income-tax,health=roundRatio(g*RULES.health,10000),gross2=g+health;
  return {gross:g,firstBase,reduction,first,second,pension,income,allowance:o.allowance,usedAllowance:Math.min(income,o.allowance),taxBase,lowerBase,upperBase,lowerTax,upperTax,beforeRelief,relief,tax,net,health,gross2,totalDues:pension+tax+health};
}
function idealNet(g,o){const reduction=g<=70000?Math.min(g,30000):g<130000?(130000-g)/2:0;const income=g-(g-reduction)*(o.pension==='both'?.15:.2)-(o.pension==='both'?g*.05:0);const b=Math.max(0,income-o.allowance);return income-(Math.min(b,500000)*o.lower/10000+Math.max(0,b-500000)*o.upper/10000)*(o.areaRelief?.5:1);}
export function calculate(amount,mode,o){
  validateOptions(o);if(!['net','gross','gross2'].includes(mode))throw new Error('Odaberite smjer izračuna.');
  if(!Number.isInteger(amount)||amount<=0)throw new Error('Provjerite iznos plaće.');
  if(mode==='gross')return {...fromGross(amount,o),requested:amount,mode,difference:0};
  const key=mode==='net'?'net':'gross2';
  const low=fromGross(RULES.minGross,o)[key],high=fromGross(RULES.maxGross,o)[key];
  if(amount<low||amount>high)throw new Error('Traženi iznos je izvan podržanog raspona za odabrane uvjete (bruto 1 od 1.050 € do 11.958 €).');
  // Locate the continuous solution, then inspect cent candidates. Rounded net can locally
  // decrease by one cent when two separately rounded contributions rise simultaneously.
  let a=RULES.minGross,b=RULES.maxGross;
  for(let i=0;i<60;i++){const m=(a+b)/2;const value=mode==='net'?idealNet(m,o):m*1.165;if(value<amount)a=m;else b=m;}
  let best=null;
  for(let g=Math.max(RULES.minGross,Math.floor(a)-12);g<=Math.min(RULES.maxGross,Math.ceil(b)+12);g++){
    const r=fromGross(g,o),distance=Math.abs(r[key]-amount);
    if(!best||distance<Math.abs(best[key]-amount))best=r;
  }
  return {...best,requested:amount,mode,difference:best[key]-amount};
}
