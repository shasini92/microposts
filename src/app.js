import {http} from './http';
import {ui} from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

// Local JSON server
const url = 'http://localhost:3000/posts';

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// Listen for cancel button
document.querySelector('.card-form').addEventListener('click', cancelEdit);

function getPosts() {
    http.get(url)
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err));
}

function submitPost() {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    const data = {
        title,
        body
    };


    // Validate input
    if (title === '' || body === '') {
        ui.showAlert('Please fill in all the fields', 'alert alert-danger');
    } else {

        // Check for ID (if ID then it's an old post)
        if (id === '') {
            // Create post
            http.post(url, data)
                .then(data => {
                    ui.showAlert('Post added', 'alert alert-success');
                    ui.clearFields();
                    getPosts();
                })
                .catch(err => console.log(err));
        } else {
            // Update Post
            http.put(`${url}/${id}`, data)
                .then(data => {
                    ui.showAlert('Post Updated', 'alert alert-success');
                    ui.changeFormState('add');
                    getPosts();
                })
                .catch(err => console.log(err));

        }


    }
}

// Delete Post
function deletePost(e) {
    if (e.target.parentElement.classList.contains('delete')) {
        const id = e.target.parentElement.dataset.id;
        if (confirm('Are you sure you want to delete?')) {
            http.delete(`${url}/${id}`)
                .then(data => {
                    ui.showAlert('Post Removed', 'alert alert-success');
                    getPosts();
                })
                .catch(err => console.log(err))
        }
    }
    e.preventDefault();
}

// Enable Edit state
function enableEdit(e) {
    // console.log(e.target);
    if (e.target.classList.contains('edit')) {
        console.log(e.target.dataset);
        const id = e.target.dataset.id;
        const body = e.target.previousElementSibling.textContent;
        const title = e.target.previousElementSibling.previousElementSibling.textContent;

        const data = {
            id,
            title,
            body
        };

        // Fill form with current post
        ui.fillForm(data);

    }

    e.preventDefault();
}

// Cancel Edit State
function cancelEdit(e) {
    if (e.target.classList.contains('post-cancel')) {
        ui.changeFormState('add');
    }

    e.preventDefault();
}