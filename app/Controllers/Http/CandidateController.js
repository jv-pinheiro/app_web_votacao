'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Candidate = use ('App/Models/Candidate')

/**
 * Resourceful controller for interacting with candidates
 */
class CandidateController {
  /**
   * Show a list of all candidates.
   * GET candidates
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const candidates = await Candidate.all()
    if(request.url() === '/'){
      return view.render('candidates', {
        candidates: candidates.toJSON()
      })
    }

    const can = candidates.toJSON()
    const total = can.reduce((total, valor) => total + valor.votes,0);

    return view.render('results',{
      candidates: can,
      porc: (c) => Math.round((c/total)*100)
    })
  }

  /**
   * Display a single candidate.
   * GET candidates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const candidates = await Candidate.query().where('id',params.id).first()
    if (!candidates){
      return response.redirect('back')
    }
    return view.render('details',{
      candidate: candidates.toJSON()
    })
  }

  /**
   * Update candidate details.
   * PUT or PATCH candidates/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, session }) {
    const candidate = await Candidate.find(params.id)
    candidate.votes = candidate.votes + 1
    
    await candidate.save()

    const candidates = await Candidate.all()

    const can = candidates.toJSON()
    const total = can.reduce((total, valor) => total + valor.votes,0);

    session.flash({
      message: `VOTO COMPUTADO. ${candidate.name} está ${Math.round((candidate.votes/total)*100)}% dos votos até agora.`,
      type: 'success'
    })

    return response.redirect('/')  
  }

}

module.exports = CandidateController
