class SearchView {
    _parantElement = document.querySelector('.search')

    getQuery() {
        return this._parantElement.querySelector('.search__field').value
    }
    _clearInput() {
        this._parantElement.querySelector('.search__field').value = ''
    }
    addHandlerSearch(handler) {
        this._parantElement.addEventListener('submit', (e) => {
            e.preventDefault()
            handler()
            this._clearInput()
        })
    }
}
export default new SearchView()
