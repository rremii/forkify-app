import * as model from './model'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultView'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import paginatorView from './views/paginatorView'
import bookmarkView from './views/bookmarkView'
import addRecipeView from './views/addRecipeView'
import { async } from 'regenerator-runtime/runtime'
import { MODAL_CLOSE_SEC } from './config'

if (module.hot) {
    module.hot.accept()
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
    try {
        let id = window.location.hash.slice(1)

        if (!id) return

        recipeView.renderSpinner()

        resultsView.update(model.getSearchResultsPage())

        bookmarkView.update(model.state.bookmarks)

        await model.loadRecipe(id)
        const { recipe } = model.state

        recipeView.render(model.state.recipe)
    } catch (err) {
        recipeView.renderError(`there was some mistake: ${err}`)
    }
}
const controlSearchResults = async () => {
    try {
        resultsView.renderSpinner()
        const query = searchView.getQuery()
        if (!query) return

        await model.loadSearchResults(query)
        // resultsView.render(model.state.search.results)
        resultsView.render(model.getSearchResultsPage(1))

        paginatorView.render(model.state.search)
    } catch (err) {
        recipeView.renderError(`there was some mistake: ${err}`)
    }
}

const controlPagination = (goToPage) => {
    resultsView.render(model.getSearchResultsPage(goToPage))

    paginatorView.render(model.state.search)
}

const controlServings = (newServings) => {
    model.updateservings(newServings)
    // recipeView.render(model.state.recipe)
    recipeView.update(model.state.recipe)
}

const controlAddBookmark = () => {
    if (!model.state.recipe.bookmarked) model.addbookMark(model.state.recipe)
    else model.deleteBookMark(model.state.recipe.id)

    recipeView.update(model.state.recipe)

    bookmarkView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
    bookmarkView.render(model.state.bookmarks)
}

const controlAddRecipe = async (newRecipe) => {
    try {
        addRecipeView.renderSpinner()

        await model.uploadRecipe(newRecipe)

        recipeView.render(model.state.recipe)
        addRecipeView.renderMessage()

        bookmarkView.render(model.state.bookmarks)
        window.history.pushState(null, '', `${model.state.recipe.id}`)

        setTimeout(() => {
            addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000
        })
    } catch (err) {
        console.log(err)
        addRecipeView.renderError(err)
    }
}

const init = () => {
    bookmarkView.addHandlerRender(controlBookmarks)
    recipeView.addHandlerHender(controlRecipes)
    recipeView.addHandlerUpdateServings(controlServings)
    recipeView.addHandlerAddBookmark(controlAddBookmark)
    searchView.addHandlerSearch(controlSearchResults)
    paginatorView.addHandlerClick(controlPagination)
    addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
