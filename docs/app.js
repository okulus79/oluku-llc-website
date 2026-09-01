function toggleMenu(){
  const nav=document.getElementById("nav");
  nav.style.display=nav.style.display==="flex"?"none":"flex";
}
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{if(innerWidth<=950)document.getElementById("nav").style.display="none"}));

document.getElementById("quoteForm").addEventListener("submit",e=>{
  e.preventDefault(); 
  const status=document.getElementById("quoteStatus");
  status.textContent="Quote request captured. Connect this form to your email/CRM endpoint for live submissions.";
  status.style.color="#0b6b3a";
});

document.getElementById("trackForm").addEventListener("submit",e=>{
  e.preventDefault();
  const num=document.getElementById("trackingNumber").value.trim();
  const box=document.getElementById("trackingResult");
  box.classList.remove("hidden");
  box.innerHTML=`<strong>${num}</strong><br><br>Demo status: <b>Shipment received</b><br>Next step: Connect this tracker to your carrier or TMS API for live location and delivery updates.`;
});

if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{});}
