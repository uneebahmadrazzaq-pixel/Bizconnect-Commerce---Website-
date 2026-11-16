const header=document.querySelector(".site-header");
const menuButton=document.querySelector(".menu-button");
const navigation=document.querySelector("#site-nav");
const mobileContact=document.querySelector(".mobile-contact");

function closeMenu(){
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","Open navigation");
  document.body.classList.remove("menu-open");
}
menuButton.addEventListener("click",function(){
  const open=navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(open));
  menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  document.body.classList.toggle("menu-open",open);
});
navigation.querySelectorAll("a").forEach(function(link){link.addEventListener("click",closeMenu)});
document.addEventListener("keydown",function(event){if(event.key==="Escape")closeMenu()});

function updateScrollUI(){
  header.classList.toggle("scrolled",window.scrollY>30);
  mobileContact.classList.toggle("visible",window.scrollY>420);
}
window.addEventListener("scroll",updateScrollUI,{passive:true});
updateScrollUI();

document.querySelector("#year").textContent=new Date().getFullYear();

const dropZone=document.querySelector("#drop-zone");
const fileInput=document.querySelector("#video-file");
const preview=document.querySelector("#file-preview");
const fileName=document.querySelector("#file-name");
const fileSize=document.querySelector("#file-size");
const removeFile=document.querySelector("#remove-file");
const form=document.querySelector("#feedback-form");
const formStatus=document.querySelector("#form-status");
const toast=document.querySelector("#toast");
const maxSize=100*1024*1024;
let selectedFile=null;

function showToast(message){
  toast.textContent=message;
  toast.classList.add("show");
  window.setTimeout(function(){toast.classList.remove("show")},2800);
}
function displayFile(file){
  formStatus.textContent="";
  formStatus.classList.remove("error");
  if(!file)return;
  if(!file.type||file.type.indexOf("video/")!==0){
    formStatus.textContent="Please choose an MP4, MOV or WebM video.";
    formStatus.classList.add("error");
    return;
  }
  if(file.size>maxSize){
    formStatus.textContent="The selected video is larger than 100 MB.";
    formStatus.classList.add("error");
    return;
  }
  selectedFile=file;
  fileName.textContent=file.name;
  fileSize.textContent=(file.size/1024/1024).toFixed(1)+" MB";
  preview.hidden=false;
}
dropZone.addEventListener("click",function(){fileInput.click()});
dropZone.addEventListener("keydown",function(event){
  if(event.key==="Enter"||event.key===" "){event.preventDefault();fileInput.click()}
});
fileInput.addEventListener("change",function(){displayFile(fileInput.files[0])});
["dragenter","dragover"].forEach(function(type){
  dropZone.addEventListener(type,function(event){event.preventDefault();dropZone.classList.add("dragging")});
});
["dragleave","drop"].forEach(function(type){
  dropZone.addEventListener(type,function(event){event.preventDefault();dropZone.classList.remove("dragging")});
});
dropZone.addEventListener("drop",function(event){displayFile(event.dataTransfer.files[0])});
removeFile.addEventListener("click",function(){
  selectedFile=null;
  fileInput.value="";
  preview.hidden=true;
  formStatus.textContent="";
});
form.addEventListener("submit",function(event){
  event.preventDefault();
  formStatus.classList.remove("error");
  if(!form.checkValidity()){
    formStatus.textContent="Please complete all required fields.";
    formStatus.classList.add("error");
    form.reportValidity();
    return;
  }
  const data=new FormData(form);
  const draft={
    name:data.get("name"),
    email:data.get("email"),
    service:data.get("service"),
    feedback:data.get("feedback"),
    videoName:selectedFile?selectedFile.name:"No video attached",
    createdAt:new Date().toISOString()
  };
  localStorage.setItem("bizconnect-mc011-draft",JSON.stringify(draft));
  formStatus.textContent="Draft saved on this device.";
  showToast("Feedback draft saved");
});