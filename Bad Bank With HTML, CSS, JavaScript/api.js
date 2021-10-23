const ctx = {
    "accounts": [
        {
            "name": "Peter",
            "email": "peter@mit.edu",
            "balance": 0,
            "password": "secret"
        }
    ]
}

function create() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const status = document.getElementById('createStatus');
    ctx.accounts.push({
        name:      name.value,
        email:     email.value,
        password:  password.value,
        balance:   0,
    });

    name.value = '';
    email.value = '';
    password.value = '';
    status.innerHTML = 'Account Created';
};

function login(){
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const container = document.getElementById('loginStatus');
    container.append(JSON.stringify(email.innerHTML));

}

function allData(){
    const status = document.getElementById('allDataStatus');
    status.innerHTML = JSON.stringify(ctx.accounts);

}