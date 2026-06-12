/*!
 * Lunr languages, `Japanese` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Chad Liu
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* throw error if Intl.Segmenter is not available */
    if ('undefined' === typeof Intl || 'undefined' === typeof Intl.Segmenter) {
      throw new Error('Intl.Segmenter is not present. Please use a runtime that supports the Intl.Segmenter API.');
    }

    /* register specific locale function */
    lunr.ja = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.ja.stopWordFilter,
        lunr.ja.stemmer
      );
      // change the tokenizer for japanese one
      lunr.tokenizer = lunr.ja.tokenizer;
    };

    lunr.ja.tokenizer = function(obj) {
      if (!arguments.length || obj == null || obj == undefined) return []
      if (Array.isArray(obj)) return obj.map(function(t) { return t.toLowerCase() })

      var str = obj.toString().trim();
      var segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
      return Array.from(segmenter.segment(str))
        .filter(function(s) { return s.isWordLike })
        .map(function(s) { return s.segment });
    };

    /* lunr stemmer function */
    lunr.ja.stemmer = (function() {
      return function(word) {
        return word;
      }
    })();

    lunr.Pipeline.registerFunction(lunr.ja.stemmer, 'stemmer-ja');

    /* stop word filter function */
    lunr.ja.stopWordFilter = function(token) {
      if (lunr.ja.stopWordFilter.stopWords.indexOf(token) === -1) {
        return token;
      }
    };

    lunr.ja.stopWordFilter.stopWords = new lunr.SortedSet();
    lunr.ja.stopWordFilter.stopWords.length = 45;

    // The space at the beginning is crucial: It marks the empty string
    // as a stop word. lunr.js crashes during search when documents
    // processed by the pipeline still contain the empty string.
    // stopwords for japanese from http://www.ranks.nl/stopwords/japanese
    lunr.ja.stopWordFilter.stopWords.elements = ' これ それ あれ この その あの ここ そこ あそこ こちら どこ だれ なに なん 何 私 貴方 貴方方 我々 私達 あの人 あのかた 彼女 彼 です あります おります います は が の に を で え から まで より も どの と し それで しかし'.split(' ');
    lunr.Pipeline.registerFunction(lunr.ja.stopWordFilter, 'stopWordFilter-ja');
  };
}))
