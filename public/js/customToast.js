function notify(value, type) {
    $.notify({
        // icon: "",
        message: value,
    }, {
        type: type,
        timer: 1000,
        placement: {
            from: "top",
            align: "right"
        },
        allow_dismiss: true,
        newest_on_top: true,
    })
}