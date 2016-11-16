function promise_wrapper (func) { // func: (resolve, reject) => ()
    return new Promise((resolve, reject) => func(resolve, reject))
}
