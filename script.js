const menu=document.querySelector(".menu"),nav=document.querySelector("nav");
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close menu":"Open menu");document.body.classList.toggle("lock",open)});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");document.body.classList.remove("lock")}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>revealObserver.observe(element));

const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const element=entry.target,target=Number(element.dataset.target),suffix=element.dataset.suffix||"",duration=1100,start=performance.now();function tick(now){const progress=Math.min((now-start)/duration,1),value=Math.floor((1-Math.pow(1-progress,3))*target);element.textContent=value+suffix;if(progress<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);counterObserver.unobserve(element)}),{threshold:.6});
document.querySelectorAll(".counter").forEach(counter=>counterObserver.observe(counter));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",event=>{glow.style.left=event.clientX+"px";glow.style.top=event.clientY+"px"},{passive:true});
document.querySelectorAll(".spotlight").forEach(card=>card.addEventListener("pointermove",event=>{const rect=card.getBoundingClientRect();card.style.setProperty("--x",event.clientX-rect.left+"px");card.style.setProperty("--y",event.clientY-rect.top+"px")}));

document.querySelector("#year").textContent=new Date().getFullYear();
const zone=document.querySelector("#drop-zone"),input=document.querySelector("#video-file"),preview=document.querySelector("#file-preview"),nameOut=document.querySelector("#file-name"),sizeOut=document.querySelector("#file-size"),remove=document.querySelector("#remove-file"),form=document.querySelector("#feedback-form"),status=document.querySelector("#form-status"),toast=document.querySelector("#toast"),maxSize=100*1024*1024;
function notify(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3200)}
function setFile(file){status.textContent="";status.classList.remove("error");if(!file)return;if(!file.type.startsWith("video/")){status.textContent="Please choose a valid video file.";status.classList.add("error");return}if(file.size>maxSize){status.textContent="That video is larger than 100 MB.";status.classList.add("error");return}const transfer=new DataTransfer();transfer.items.add(file);input.files=transfer.files;nameOut.textContent=file.name;sizeOut.textContent=(file.size/1024/1024).toFixed(1)+" MB";preview.hidden=false}
zone.addEventListener("click",()=>input.click());
zone.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();input.click()}});
input.addEventListener("change",()=>setFile(input.files[0]));
["dragenter","dragover"].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();zone.classList.add("dragging")}));
["dragleave","drop"].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();zone.classList.remove("dragging")}));
zone.addEventListener("drop",event=>setFile(event.dataTransfer.files[0]));
remove.addEventListener("click",()=>{input.value="";preview.hidden=true;status.textContent=""});
form.addEventListener("submit",event=>{event.preventDefault();status.classList.remove("error");if(!form.checkValidity()){status.textContent="Please complete the required fields.";status.classList.add("error");form.reportValidity();return}const data=new FormData(form),submission={name:data.get("name"),email:data.get("email"),service:data.get("service"),feedback:data.get("feedback"),videoName:input.files[0]?.name||"No video attached",createdAt:new Date().toISOString()};localStorage.setItem("bizconnect-mc011-draft",JSON.stringify(submission));status.textContent="Submission prepared and saved securely on this device.";notify("Feedback draft prepared successfully")});