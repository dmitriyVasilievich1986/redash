const newObj = {
    id: 1,
    name: "qwe",
    slug: "qwe",
    test: "test",
    updated: true,
}

class ITry {
    constructor(props) {
        this.test = props.test
    }
}

class IDashboard extends ITry {
    constructor(props) {
        super(props)
        this.id = props.id
        this.name = props.name
        this.slug = props.slug
        this.newName = props.newName ? props.newName : props.name
        this.updated = props.updated ? props.updated : false
    }
    initialize() {
        this.newName = this.name
        this.updated = false
        return this
    }
}

console.log(new IDashboard(newObj).initialize())
// const obj = new IDashboard(newObj)
// console.log(obj.updated)
// console.log(obj.initialize().id)