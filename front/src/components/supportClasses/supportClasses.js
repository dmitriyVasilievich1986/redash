//#region Конструкторы классов dashboard, querie, visualizations

class IResponseObject {
    constructor(props) {
        this.id = props.id
        this.name = props.name
        this.updated = props.updated || false
        this.newName = props.newName || props.name
    }
}

class IDashboard extends IResponseObject {
    constructor(props) {
        super(props)
        const contractIDMatch = props.name.match(/ContractID_<.*?>/g)

        this.tags = props.tags
        this.slug = props.slug
        this.newTags = props.newTags || props.tags
        this.queries = props.queriesID || this.getQueriesIDFromTags(props.tags)
        this.visualizations = props.visualizations || props.widgets.map(w => w.visualization.id)
        this.newVisualizations = props.newVisualizations || props.widgets.map(w => w.visualization.id)
        this.contractID = contractIDMatch ? contractIDMatch[0].replaceAll(/ContractID_<|>/g, "") : ""
        this.public_url = props.public_url && props.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') || null
    }
    initialize() {
        this.updated = false
        this.newName = this.name
        this.newTags = this.tags
        this.newVisualizations = this.visualizations
    }
    getQueriesIDFromTags(tags) {
        const queriesID = tags
            .filter(t => t.match(/querie_/) !== null)
            .map(t => parseInt(t.match(/querie_.*/g)[0].replace('querie_', '')))
        return queriesID
    }
    needUpdateVisualizations(newVisualizations = this.newVisualizations) {
        if (newVisualizations.length != this.visualizations.length)
            return true
        return this.visualizations.map(v => newVisualizations.indexOf(v) >= 0).indexOf(false) >= 0
    }
    updateVisualizations(visualizationID) {
        let payload = []
        if (this.newVisualizations.indexOf(visualizationID) >= 0) {
            payload = this.newVisualizations.filter(nv => nv != visualizationID)
        } else {
            payload = [...this.newVisualizations, visualizationID]
        }
        return payload
    }
}

class IQuerie extends IResponseObject {
    constructor(props) {
        super(props)
        this.query = props.query
        this.newQuery = this.newQuery || null
        this.visualizations = this.visualizations || props.visualizations.map(v => v.id)
    }
    initialize() {
        this.updated = false
        this.newName = this.name
        this.newQuery = this.query
    }
}

class IVisualization extends IResponseObject {
    constructor(props, querie = null, visualizations = []) {
        super(props)
        this.querie = querie || props.querie
        this.inDashboard = this.inDashboard || visualizations.indexOf(this.id) >= 0
    }
    initialize(visualizations = []) {
        this.updated = false
        this.newName = this.name
        this.inDashboard = visualizations.indexOf(this.id) >= 0
    }
    setInDashboard(visualizations = []) {
        this.inDashboard = visualizations.indexOf(this.id) >= 0
    }
}

export {
    IVisualization,
    IDashboard,
    IQuerie,
}

//#endregion