import { http } from './http';
import { ui} from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Local JSON server
const url = 'http://localhost:3000/posts';

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

function getPosts() {
    http.get(url)
        .then(data=>ui.showPosts(data))
        .catch(err=>console.log(err));
}

function submitPost() {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;

    const data = {
        title,
        body
    };

    // Create Post
    http.post(url, data)
        .then(data => {
            ui.showAlert('Post added', 'alert alert-success');
            ui.clearFields();
            getPosts();
        })
        .catch(err => console.log(err));
}

// Delete Post
function deletePost(e) {
    if(e.target.parentElement.classList.contains('delete')){
        const id = e.target.parentElement.dataset.id;
        if(confirm('Are you sure you want to delete?')){
            http.delete(`${url}/${id}`)
                .then(data=>{
                    ui.showAlert('Post Removed', 'alert alert-success');
                    getPosts();
                })
                .catch(err=>console.log(err))
        }
    }


    e.preventDefault();
}