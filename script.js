document.body.classList.add("js-ready");
const menu=document.querySelector(".menu");
const nav=document.querySelector("nav");
menu.addEventListener("click",function(){const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close menu":"Open menu");document.body.classList.toggle("lock",open)});
nav.querySelectorAll("a").forEach(function(link){link.addEventListener("click",function(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");document.body.classList.remove("lock")})});

const revealElements=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:"0px 0px -30px 0px"});
  revealElements.forEach(function(element){observer.observe(element)});
  window.setTimeout(function(){revealElements.forEach(function(element){element.classList.add("visible")})},1600);
}else{revealElements.forEach(function(element){element.classList.add("visible")})}

document.querySelector("#year").textContent=new Date().getFullYear();
const zone=document.querySelector("#drop-zone");
const input=document.querySelector("#video-file");
const preview=document.querySelector("#file-preview");
const nameOut=document.querySelector("#file-name");
const sizeOut=document.querySelector("#file-size");
const remove=document.querySelector("#remove-file");
const form=document.querySelector("#feedback-form");
const status=document.querySelector("#form-status");
const toast=document.querySelector("#toast");
const maxSize=100*1024*1024;
let selectedFile=null;

function notify(message){toast.textContent=message;toast.classList.add("show");window.setTimeout(function(){toast.classList.remove("show")},2800)}
function showFile(file){
  status.textContent="";status.classList.remove("error");
  if(!file)return;
  if(!file.type||file.type.indexOf("video/")!==0){status.textContent="Please choose a valid video file.";status.classList.add("error");return}
  if(file.size>maxSize){status.textContent="That video is larger than 100 MB.";status.classList.add("error");return}
  selectedFile=file;nameOut.textContent=file.name;sizeOut.textContent=(file.size/1024/1024).toFixed(1)+" MB";preview.hidden=false
}
zone.addEventListener("click",function(){input.click()});
zone.addEventListener("keydown",function(event){if(event.key==="Enter"||event.key===" "){event.preventDefault();input.click()}});
input.addEventListener("change",function(){showFile(input.files[0])});
["dragenter","dragover"].forEach(function(type){zone.addEventListener(type,function(event){event.preventDefault();zone.classList.add("dragging")})});
["dragleave","drop"].forEach(function(type){zone.addEventListener(type,function(event){event.preventDefault();zone.classList.remove("dragging")})});
zone.addEventListener("drop",function(event){showFile(event.dataTransfer.files[0])});
remove.addEventListener("click",function(){selectedFile=null;input.value="";preview.hidden=true;status.textContent=""});
form.addEventListener("submit",function(event){
  event.preventDefault();status.classList.remove("error");
  if(!form.checkValidity()){status.textContent="Please complete the required fields.";status.classList.add("error");form.reportValidity();return}
  const data=new FormData(form);
  const submission={name:data.get("name"),email:data.get("email"),service:data.get("service"),feedback:data.get("feedback"),videoName:selectedFile?selectedFile.name:"No video attached",createdAt:new Date().toISOString()};
  localStorage.setItem("bizconnect-mc011-draft",JSON.stringify(submission));
  status.textContent="Feedback draft saved on this device.";notify("Feedback draft prepared successfully")
});