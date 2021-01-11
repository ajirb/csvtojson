const url = window.location.origin
const btnUpload = document.getElementById("btnUpload")
const btnDownload = document.getElementById("btnDownload")
const txtMessage = document.getElementById('txtMessage')
const progressStatus = document.getElementById('progressStatus')
const progress_wrapper = document.getElementById('progressWrapper')
const progress = document.getElementById('progress')
const input = document.getElementById('fileSelector')
const fileInputLabel = document.getElementById('fileInputLabel')

const showAlert = (msg, bootstrapType)=>{
    txtMessage.style.display = "block"
    txtMessage.innerHTML =`
    <div class="alert alert-${bootstrapType} alert-dismissible fade show">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    ${msg}
  </div>
    `
}

btnUpload.addEventListener('click', ()=>{
    txtMessage.style.display = "none"

    if(input.value==undefined || input.value==""){
        showAlert("No File Selected", "danger")
        return;
    }

    let name = input.value.split('.')
	if(name[name.length-1]!="csv"){
        input.value=""
        showAlert("Plase Select CSV File", "danger")
        return;
    }

    const file = input.files[0];
    let formData = new FormData()
    formData.append("myfile", file);

    input.disabled = true
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = 'json';

    xhr.onload = ()=>{
        reset()
        let data = xhr.response
        
        showAlert(data["msg"], "success")
        input.value = ""
    }

    xhr.onprogress = (e)=>{
        let loaded = e.loaded
        let total = e.total

        let done = (loaded/total)*100

        progress.style.width = Math.floor(done)
        progressStatus.innerText = `${Math.floor(done)}% uploaded`

    }

    xhr.send(formData);
	return;
});

const reset = ()=>{
    input.disabled = false
    input.value=null
    btnUpload.classList.remove('d-none')
    progress_wrapper.classList.add('d-none')
    progress.style.width = 0
    fileInputLabel.innerText = "Select file"
}

const get_filename = ()=>{
    fileInputLabel.innerText = input.files[0].name
}

btnDownload.addEventListener('click', ()=>{
    progress_wrapper.classList.add('d-none')
    progress.style.width = 0

    const xhr = new XMLHttpRequest();
    const path = url + "/download"

    xhr.open("GET",path)
    xhr.responseType = 'text/json'

    xhr.onload = (e)=>{
        if(xhr.status == 200){
            let a = document.createElement("a")
            a.href="/getFile"
            a.click()
        }
        else{
            let data = JSON.parse(xhr.response);
            showAlert(data["msg"], "danger")
        }
    }
    xhr.send()
})

window.addEventListener("load",()=>{
    input.value=""
})


