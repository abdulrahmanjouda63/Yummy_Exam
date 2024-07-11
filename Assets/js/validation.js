// Initialize global variables
var pass;  //password
var valid_flags = new Array(6).fill(0);

//All validation functions object
export const valid_obj = {
    name(name) {
        return String(name)
            .match(
                /^[a-zA-Z ]+$/
            );
    },
    email(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    },
    phone(phone) {
        return String(phone)
            .match(
                /^((\+20|0)1[0-25]|01[0-9])\d{8}$/
            );
    },
    age(age) {
        return String(age)
            .match(
                /^(1\d{1}|[2-9][0-9])$/
            );
    },
    password(password) {
        return pass = String(password)
            .match(
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            );
    },
    repassword(password) {
        if(pass && password == pass) return true;
    }
}



//validation check
/**
 * 
 * @param {String} ele - selected html element
 * @param {Number} index - index of selected current element from nodeList (iterable list)
 * @param {String} name  - validation function's name from an object of validation functions
 * @returns 
 */
export function validCheck_All_byIndex(ele, index, name) {
    let func = valid_obj[name](ele.value);

    if(ele.getAttribute('name') == name) {
        if(ele.value && !func){
            ele.classList.add('is-invalid');
            valid_flags[index] = 0;
        } else if(!ele.value) {
            ele.classList.remove('is-invalid');
            valid_flags[index] = 0;
        } else if(func) {
            ele.classList.remove('is-invalid');
            valid_flags[index] = 1;
        }
    }
    return valid_flags;
}