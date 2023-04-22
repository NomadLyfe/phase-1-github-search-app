document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        searchHandler(form.search.value);
    });
    function searchHandler(searchedTerm) {
        fetch(`https://api.github.com/search/users?q=${searchedTerm}`)
            .then(resp => resp.json())
            .then(data => makeSearchedList(data));
    };
    function makeSearchedList(userList) {
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        p1.textContent = `Searched: ${form.search.value}`;
        p2.textContent = `Total results: ${userList.total_count}`;
        const ul = document.querySelector('#user-list');
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        const li = document.createElement('li');
        li.appendChild(p1);
        li.appendChild(p2);
        ul.appendChild(li);
        for (const user of userList.items) {
            const li = document.createElement('li');
            const h2 = document.createElement('h2');
            const img = document.createElement('img');
            const link = document.createElement('a');
            const p3 = document.createElement('p');
            li.className = 'card';
            h2.textContent = user.login;
            img.src = user.avatar_url;
            link.href = user.html_url;
            link.innerHTML = '<p>Profile Link</p>';
            p3.textContent = 'Repositories:';
            p3.style.cursor = 'pointer';
            li.appendChild(h2);
            li.appendChild(img);
            li.appendChild(link);
            li.appendChild(p3);
            ul.appendChild(li);
            p3.addEventListener('click', (e) => {
                const loginUser = e.target.parentNode.firstChild.textContent;
                fetch(`https://api.github.com/users/${loginUser}/repos`)
                    .then(resp => resp.json())
                    .then(data => {
                        if (e.target.firstChild.nextSibling === null) {
                            console.log(data);
                            const ul = document.createElement('ul');
                            ul.className = 'repoList';
                            e.target.appendChild(ul);
                            for (const element of data) {
                                const li1 = document.createElement('li');
                                const li2 = document.createElement('li');
                                li1.className = 'repo';
                                li2.className = 'repo';
                                li1.textContent = `Name: ${element.name}`
                                li2.innerHTML = `Link: ${element.html_url} <br><br>`;
                                ul.appendChild(li1);
                                ul.appendChild(li2);
                            }
                        }
                    });
            });
        }
        form.reset();
    };

});
