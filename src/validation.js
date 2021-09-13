const validate = (rules, index, inputEl, errMessageEl) => {
    let testResult = rules[index].test(inputEl.value); //point to rule of input element

    if (testResult) {
        errMessageEl.innerText = testResult;
        inputEl.classList.add("inputerrstate");
    }
    else {
        errMessageEl.innerText = "";
        inputEl.classList.remove("inputerrstate");
    }
}
const validation = (formEl, rules, submit = false) => {
    let childrenEl = formEl.children;
    childrenEl.forEach((child, index) => {
        let inputEl = child.children[1];
        let errMessageEl = child.children[2];
        if (inputEl) {
            if (submit) {
                validate(rules, index, inputEl, errMessageEl);
            } else {
                inputEl.onblur = () => {
                    validate(rules, index, inputEl, errMessageEl);
                }
                inputEl.oninput = () => {
                    if (inputEl.value) {
                        errMessageEl.innerText = "";
                        inputEl.classList.remove("inputerrstate");
                    }
                }
            }
        }
    })
    if (submit) {
        let isValid = true;
        for (let i = 0; i < childrenEl.length - 1; i++) {
            let errMessageEl = childrenEl[i].children[2];
            if (errMessageEl.innerText !== '') {
                isValid = false;
                break;
            }
        }
        return isValid;
    }
}
validation.isRequired = () => {
    return {
        test(value) {
            return value.trim() ? undefined : "Please fill out this field"
        }
    }
}
validation.isEmail = () => {
    return {
        test(email) {
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let result = emailRegex.test(email);
            if (!email) {
                return "Please fill out this field"
            } else if (!result) {
                return "This email is invalid"
            }
            return undefined
        }
    }
}
validation.isPassword = (passwordLength) => {
    return {
        test(value) {
            if (value) {
                return value.length < Number(passwordLength) ? `Passwords must be at least ${passwordLength} characters` : undefined;
            } else {
                return "Please fill out this field";
            }
        }
    }
}
validation.isConfirmPassword = (password) => {
    return {
        test(value) {
            if (value) {
                return value !== password() ? "The password confirmation does not match" : undefined;
            } else {
                return "Please fill out this field";
            }
        }
    }
}
export default validation;