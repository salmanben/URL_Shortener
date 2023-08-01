var main = document.querySelector(".main")
var shorten = document.querySelector("#shorten");
var originalURLInput = document.querySelector("#original-URL-input");
var totalLinks = document.getElementById("total-links")
var totalClicks = document.getElementById("total-clicks")
var deleteAll = document.getElementById("delete-all")
var container = document.getElementById("container")
var wrapper = document.querySelector(".wrapper")
var message = document.querySelector(".message")
var copy = document.querySelector("#copy")
var shortenURLInput = document.querySelector("#shorten-URL-input");
var save = document.getElementById("save")
var closeSymb = document.querySelector(".close")
if(localStorage.getItem("userId")){
	var id = JSON.parse(localStorage.getItem("userId"));
	fetch(`actions.php?id=${id}`)
	.then(res=>res.json())
	.then(data=>{
	 if(data.length > 0)
	 for(var i =0; i < data.length; i++){
		 container.innerHTML += `
		 <tr>
		 <td><a href = "${data[i].original_url}" target="_blank">${data[i].original_url.length >= 60 ? data[i].original_url.slice(0,60) + '...' : data[i].original_url }</a></td>
		 <td><a href = "?u=${data[i].shorten_url}" target="_blank" onclick = "increaseClicks()">localhost/URL_Shortener?u=${data[i].shorten_url}</a></td>
		 <td>${data[i].clicks}</td>
		 <td><button onclick = "deleteEle()" id = "${data[i].url_id}">delete</button></td>
		</tr>`
 
	 }else{
		container.parentNode.style.display = "none"
		totalClicks.parentNode.parentNode.style.display = "none"
	 }
	   
	})
 }else{
	 const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	 notUnique = true;
	(async function generateUniqueId(){
	 while(notUnique){
		 try{
			 var id = [];
			 for (let i = 0; i < 13; i++) {
			   id[i] = characters[Math.floor(Math.random() * characters.length)];
			 }
			 id = id.join('');
			 var response = await fetch(`actions.php?checkId=${id}`)
			 var data = await  response.text()
			 if(data == '1'){
				 notUnique = false
				 localStorage.setItem("userId",JSON.stringify(id))
			 }
		 }
		 catch(err){
			 console.log(err);
			 break;
		 }
 
		}
	 })()
	 }  
originalURLInput.onkeyup = () => {
	if (originalURLInput.value != '') {
		shorten.style.opacity = 1
		shorten.style.pointerEvents = 'auto';
	} else {
		shorten.style.opacity = 0
		shorten.style.pointerEvents = 'none';
	}
}
originalURLInput.onpaste = ()=>shorten.style.opacity = 1


shorten.onclick = () => {
	originalURLInput = document.querySelector("#original-URL-input");
	if (originalURLInput.value == '')
		return
	fetch("actions.php?checkURL=1", {
			method: "POST",
			body: JSON.stringify({
				url: originalURLInput.value
			}),
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(res => res.text())
		.then(data => {
			if (data.length <= 5) {
				wrapper.classList.add("active")
				main.style.filter = "blur(2px)";
				message.innerText = "Your shortened link is ready. You can now copy and save it."
				shortenURLInput.value = "localhost/URL_Shortener?u=" + data;

				setTimeout(function() {
					window.addEventListener("click", chechCursorPos)
				}, 60)
			} else alert(data)
		}).catch(err=>alert("something went wrong. please try again"))

}


function chechCursorPos(e) {
	if (!((e.pageX >= wrapper.offsetLeft - wrapper.offsetWidth / 2 && e.pageX <= wrapper.offsetLeft + wrapper.offsetWidth / 2) &&
			(e.pageY >= wrapper.offsetTop - wrapper.offsetHeight / 2 && e.pageY <= wrapper.offsetTop + wrapper.offsetHeight / 2))) {
		closeWrapper()
	}
}
closeWrapper = () => {
	wrapper.classList.remove("active")
	main.style.filter = "none"
	shortenURLInput.value = ''
	shorten.style.opacity = 0
	shorten.style.pointerEvents = 'none';
	originalURLInput.value = ''
	message.classList.remove("error")
	message.classList.add("success")
	window.removeEventListener("click", chechCursorPos)
}
closeSymb.onclick = closeWrapper


copy.onclick = () => {
	if (shortenURLInput.value != '') {
		navigator.clipboard.writeText(shortenURLInput.value)
			.then(() => {
				message.innerText = "Text copied successfully"
				message.classList.add("success")
                message.classList.remove("error")

			}).catch(err => {
				message.innerText = "Failed to copy text"
				message.classList.add("error")
                message.classList.remove("success")
			})
	}
}
save.onclick = () => {
	var arr = shortenURLInput.value.split('=')
	fetch(`actions.php?save=${id}`, {
			method: 'POST',
			body: JSON.stringify({
				s_url: arr[1],
				o_url: originalURLInput.value
			}),
			headres: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.text())
		.then(data => {
			if (data != 0) {
				var str = originalURLInput.value.length >= 80 ? originalURLInput.value.slice(0, 60) + "..." : originalURLInput.value
				container.innerHTML = `<tr>
                <td><a href = "${originalURLInput.value}" target="_blank">${str}</a></td>
                <td><a href = "?u=${arr[1]}"target="_blank" onclick = "increaseClicks()">localhost/URL_Shortener?u=${arr[1]}"</a></td>
                <td>0</td>
                <td><button onclick = "deleteEle()" id = '${data}'>delete</button></td>
               </tr>` + container.innerHTML
				closeWrapper()
				container.parentNode.style.display = "block"
				totalClicks.parentNode.parentNode.style.display = "flex"
				var x = Number(totalLinks.innerText)
				totalLinks.innerText = x + 1

			} else {
				message.innerText = "Something went wrong. Please try again."
				message.classList.add("error")
				message.classList.remove("success")
			}

		})
		.catch(err => alert("Something went wrong. Please try again."))


}
deleteAll.onclick = () => {
	var id = JSON.parse(localStorage.getItem("userId"));
	fetch(`actions.php?delete=all&user_id=${id}`)
		.then(res => res.text())
		.then(data => {
			if (data == 1) {
				container.innerHTML = ''
				container.parentNode.style.display = "none"
				totalClicks.parentNode.parentNode.style.display = "none"
				totalClicks.innerText = 0
				totalLinks.innerText = 0
			} else {
				
				alert("something went wrong. please try again")
			}
		})
}

function deleteEle() {
	var element = event.target
	var id = element.id;
	fetch(`actions.php?delete=${id}`)
		.then(res => res.text())

		.then(data => {	
			if (data == 1) {
				var numClicks = Number(element.parentNode.previousElementSibling.innerText)
				var x = Number(totalLinks.innerText)
				totalLinks.innerText = x - 1
				var y = Number(totalClicks.innerText)
				totalClicks.innerText = y - numClicks
				element.parentNode.parentNode.remove()
				if (container.innerText == '') {
					container.parentNode.style.display = "none"
					totalClicks.parentNode.parentNode.style.display = "none"
				}

			} else {
				alert("something went wrong. please try again")
			}
		})
}



function increaseClicks() {
	var element = event.target;
	var x = Number(element.parentNode.nextElementSibling.innerText)
	element.parentNode.nextElementSibling.innerText = x + 1
	var y = Number(totalClicks.innerText)
	totalClicks.innerText = y + 1;

}


