(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Prism.languages.clojure = {
    'comment': /;;[^\r\n]*(\r?\n|$)/g,
    'string': /(")(\\?.)*?\1/g,
    'operator ': /(::|[:|'])\b[a-zA-Z][a-zA-Z0-9*+!-_?]*\b/g, //used for symbols and keywords
    'keyword': /\b(def|if|do|let|quote|var|fn|loop|recur|throw|try|monitor-enter|\.|new|set!|def\-|defn|defn\-|defmacro|defmulti|defmethod|defstruct|defonce|declare|definline|definterface|defprotocol|defrecord|deftype|defproject|ns|\*|\+|\-|\->|\/|<|<=|=|==|>|>=|\.\.|accessor|agent|agent-errors|aget|alength|all-ns|alter|and|append-child|apply|array-map|aset|aset-boolean|aset-byte|aset-char|aset-double|aset-float|aset-int|aset-long|aset-short|assert|assoc|await|await-for|bean|binding|bit-and|bit-not|bit-or|bit-shift-left|bit-shift-right|bit-xor|boolean|branch\?|butlast|byte|cast|char|children|class|clear-agent-errors|comment|commute|comp|comparator|complement|concat|conj|cons|constantly|cond|if-not|construct-proxy|contains\?|count|create-ns|create-struct|cycle|dec|deref|difference|disj|dissoc|distinct|doall|doc|dorun|doseq|dosync|dotimes|doto|double|down|drop|drop-while|edit|end\?|ensure|eval|every\?|false\?|ffirst|file-seq|filter|find|find-doc|find-ns|find-var|first|float|flush|for|fnseq|frest|gensym|get-proxy-class|get|hash-map|hash-set|identical\?|identity|if-let|import|in-ns|inc|index|insert-child|insert-left|insert-right|inspect-table|inspect-tree|instance\?|int|interleave|intersection|into|into-array|iterate|join|key|keys|keyword|keyword\?|last|lazy-cat|lazy-cons|left|lefts|line-seq|list\*|list|load|load-file|locking|long|loop|macroexpand|macroexpand-1|make-array|make-node|map|map-invert|map\?|mapcat|max|max-key|memfn|merge|merge-with|meta|min|min-key|name|namespace|neg\?|new|newline|next|nil\?|node|not|not-any\?|not-every\?|not=|ns-imports|ns-interns|ns-map|ns-name|ns-publics|ns-refers|ns-resolve|ns-unmap|nth|nthrest|or|parse|partial|path|peek|pop|pos\?|pr|pr-str|print|print-str|println|println-str|prn|prn-str|project|proxy|proxy-mappings|quot|rand|rand-int|range|re-find|re-groups|re-matcher|re-matches|re-pattern|re-seq|read|read-line|reduce|ref|ref-set|refer|rem|remove|remove-method|remove-ns|rename|rename-keys|repeat|replace|replicate|resolve|rest|resultset-seq|reverse|rfirst|right|rights|root|rrest|rseq|second|select|select-keys|send|send-off|seq|seq-zip|seq\?|set|short|slurp|some|sort|sort-by|sorted-map|sorted-map-by|sorted-set|special-symbol\?|split-at|split-with|str|string\?|struct|struct-map|subs|subvec|symbol|symbol\?|sync|take|take-nth|take-while|test|time|to-array|to-array-2d|tree-seq|true\?|union|up|update-proxy|val|vals|var-get|var-set|var\?|vector|vector-zip|vector\?|when|when-first|when-let|when-not|with-local-vars|with-meta|with-open|with-out-str|xml-seq|xml-zip|zero\?|zipmap|zipper)\b/g,
    'boolean': /\b(true|false)\b/g,
    'number': /\b-?(0x)?\d*\.?\d+\b/g,
    'punctuation': /[{}\[\](),]/g
};

},{}],2:[function(require,module,exports){
(function (global){

/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += (strarr[i].matchedStr || strarr[i]).length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += (strarr[k].matchedStr || strarr[k]).length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.matchedStr = matchedStr || null;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var backdrops;

    function createBackdropForSlide(slide) {
      var backdropAttribute = slide.getAttribute('data-bespoke-backdrop');

      if (backdropAttribute) {
        var backdrop = document.createElement('div');
        backdrop.className = backdropAttribute;
        backdrop.classList.add('bespoke-backdrop');
        deck.parent.appendChild(backdrop);
        return backdrop;
      }
    }

    function updateClasses(el) {
      if (el) {
        var index = backdrops.indexOf(el),
          currentIndex = deck.slide();

        removeClass(el, 'active');
        removeClass(el, 'inactive');
        removeClass(el, 'before');
        removeClass(el, 'after');

        if (index !== currentIndex) {
          addClass(el, 'inactive');
          addClass(el, index < currentIndex ? 'before' : 'after');
        } else {
          addClass(el, 'active');
        }
      }
    }

    function removeClass(el, className) {
      el.classList.remove('bespoke-backdrop-' + className);
    }

    function addClass(el, className) {
      el.classList.add('bespoke-backdrop-' + className);
    }

    backdrops = deck.slides
      .map(createBackdropForSlide);

    deck.on('activate', function() {
      backdrops.forEach(updateClasses);
    });
  };
};

},{}],4:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var activeSlideIndex,
      activeBulletIndex,

      bullets = deck.slides.map(function(slide) {
        return [].slice.call(slide.querySelectorAll((typeof options === 'string' ? options : '[data-bespoke-bullet]')), 0);
      }),

      next = function() {
        var nextSlideIndex = activeSlideIndex + 1;

        if (activeSlideHasBulletByOffset(1)) {
          activateBullet(activeSlideIndex, activeBulletIndex + 1);
          return false;
        } else if (bullets[nextSlideIndex]) {
          activateBullet(nextSlideIndex, 0);
        }
      },

      prev = function() {
        var prevSlideIndex = activeSlideIndex - 1;

        if (activeSlideHasBulletByOffset(-1)) {
          activateBullet(activeSlideIndex, activeBulletIndex - 1);
          return false;
        } else if (bullets[prevSlideIndex]) {
          activateBullet(prevSlideIndex, bullets[prevSlideIndex].length - 1);
        }
      },

      activateBullet = function(slideIndex, bulletIndex) {
        activeSlideIndex = slideIndex;
        activeBulletIndex = bulletIndex;

        bullets.forEach(function(slide, s) {
          slide.forEach(function(bullet, b) {
            bullet.classList.add('bespoke-bullet');

            if (s < slideIndex || s === slideIndex && b <= bulletIndex) {
              bullet.classList.add('bespoke-bullet-active');
              bullet.classList.remove('bespoke-bullet-inactive');
            } else {
              bullet.classList.add('bespoke-bullet-inactive');
              bullet.classList.remove('bespoke-bullet-active');
            }

            if (s === slideIndex && b === bulletIndex) {
              bullet.classList.add('bespoke-bullet-current');
            } else {
              bullet.classList.remove('bespoke-bullet-current');
            }
          });
        });
      },

      activeSlideHasBulletByOffset = function(offset) {
        return bullets[activeSlideIndex][activeBulletIndex + offset] !== undefined;
      };

    deck.on('next', next);
    deck.on('prev', prev);

    deck.on('slide', function(e) {
      activateBullet(e.index, 0);
    });

    activateBullet(0, 0);
  };
};

},{}],5:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var parseHash = function() {
      var hash = window.location.hash.slice(1),
        slideNumberOrName = parseInt(hash, 10);

      if (hash) {
        if (slideNumberOrName) {
          activateSlide(slideNumberOrName - 1);
        } else {
          deck.slides.forEach(function(slide, i) {
            if (slide.getAttribute('data-bespoke-hash') === hash) {
              activateSlide(i);
            }
          });
        }
      }
    };

    var activateSlide = function(index) {
      var indexToActivate = -1 < index && index < deck.slides.length ? index : 0;
      if (indexToActivate !== deck.slide()) {
        deck.slide(indexToActivate);
      }
    };

    setTimeout(function() {
      parseHash();

      deck.on('activate', function(e) {
        var slideName = e.slide.getAttribute('data-bespoke-hash');
        window.location.hash = slideName || e.index + 1;
      });

      window.addEventListener('hashchange', parseHash);
    }, 0);
  };
};

},{}],6:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var isHorizontal = options !== 'vertical';

    document.addEventListener('keydown', function(e) {
      if (e.which == 34 || // PAGE DOWN
        (e.which == 32 && !e.shiftKey) || // SPACE WITHOUT SHIFT
        (isHorizontal && e.which == 39) || // RIGHT
        (!isHorizontal && e.which == 40) // DOWN
      ) { deck.next(); }

      if (e.which == 33 || // PAGE UP
        (e.which == 32 && e.shiftKey) || // SPACE + SHIFT
        (isHorizontal && e.which == 37) || // LEFT
        (!isHorizontal && e.which == 38) // UP
      ) { deck.prev(); }
    });
  };
};

},{}],7:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var clients = [],
      currentStep = 0,
      broadcast = function() {
        clients.forEach(function(client) {
          client.postMessage(['CURSOR', (deck.slide() + 1) + '.' + currentStep].join(' '), '*');
        });
      },
      getSteps = function(slide) {
        return deck.slides[slide].querySelectorAll('.bespoke-bullet').length;
      },
      hasStep = function(slide, step) {
        return getSteps(slide) > step;
      },
      getStep = function() {
        var bullets = deck.slides[deck.slide()].querySelectorAll('.bespoke-bullet');
        for (var i = 0, len = bullets.length; i < len; i++) {
          if (bullets[i].classList.contains('bespoke-bullet-current')) return i;
        }
        return 0;
      },
      onMessage = function(e) {
        var argv = e.data.split(' ');
        var client = e.source;
        switch(argv[0]) {
          case 'REGISTER':
            clients.push(client);
            client.postMessage(['REGISTERED', encodeURIComponent(document.title || 'Untitled'), deck.slides.length].join(' '), '*');
            broadcast();
            break;
          case 'FORWARD':
            deck.next();
            currentStep = getStep();
            broadcast();
            break;
          case 'BACK':
            deck.prev();
            currentStep = getStep();
            broadcast();
            break;
          case 'START':
            deck.slide(0, { preview: true });
            currentStep = 0;
            broadcast();
            break;
          case 'END':
            deck.slide(deck.slides.length - 1, { preview: true });
            currentStep = 0;
            broadcast();
            break;
          case 'SET_CURSOR':
            var cursor = argv[1] || '1', slide, step;
            if (cursor.indexOf('.') !== -1) {
              var cursorv = cursor.split('.', 2).map(function(n) { return ~~n; });
              slide = cursorv[0];
              step = cursorv[1];
            }
            else {
              slide = ~~cursor;
              step = 0;
            }
            if (step > 0 && !hasStep(slide - 1, step)) {
              slide += 1;
              step = 0;
            }
            if (slide < 1) {
              slide = 1;
            }
            else if (slide > deck.slides.length) {
              slide = deck.slides.length;
            }
            // TODO if slide/step only differs by a substep, use next()/prev() to get there
            deck.slide(slide - 1, { preview: true });
            // HACK step through bullets
            for (var i = 0; i < step; i++) deck.next();
            //currentStep = getStep();
            currentStep = step;
            broadcast();
            break;
          case 'GET_NOTES':
            var node = deck.slides[deck.slide()].querySelector('[role=note]'),
              content = node ? encodeURIComponent(node.innerHTML) : '';
            client.postMessage(['NOTES', content].join(' '), '*');
            break;
        }
      };
    deck.on('destroy', function() {
      removeEventListener('message', onMessage, false);
    });
    addEventListener('message', onMessage, false);
  };
};

},{}],8:[function(require,module,exports){
module.exports = function(opts) {
  require('insert-css')('.bespoke-parent.bespoke-overview{pointer-events:auto}' +
    '.bespoke-overview :not(img){pointer-events:none}' +
    '.bespoke-overview .bespoke-slide{opacity:1;visibility:visible;cursor:pointer;pointer-events:auto}' +
    '.bespoke-overview .bespoke-active{outline:6px solid #cfd8dc;outline-offset:-3px;-moz-outline-radius:3px}' +
    '.bespoke-overview .bespoke-bullet{opacity:1;visibility:visible}' +
    '.bespoke-overview-counter{counter-reset:overview}' +
    '.bespoke-overview-counter .bespoke-slide::after{counter-increment:overview;content:counter(overview);position:absolute;right:.75em;bottom:.5em;font-size:1.25rem;line-height:1.25}' +
    '.bespoke-title{visibility:hidden;position:absolute;top:0;left:0;width:100%;pointer-events:auto}' +
    '.bespoke-title h1{margin:0;font-size:1.6em;line-height:1.2;text-align:center}' +
    '.bespoke-overview:not(.bespoke-overview-to) .bespoke-title{visibility:visible}' +
    '.bespoke-overview-to .bespoke-active,.bespoke-overview-from .bespoke-active{z-index:1}', { prepend: true });
  return function(deck) {
    opts = typeof opts === 'object' ? opts : {};
    var KEY_O = 79, KEY_ENT = 13, KEY_UP = 38, KEY_DN = 40,
      RE_CSV = /, */, RE_NONE = /^none(?:, ?none)*$/, RE_TRANS = /^translate\((.+?)px, ?(.+?)px\) scale\((.+?)\)$/, RE_MODE = /(^\?|&)overview(?=$|&)/,
      TRANSITIONEND = !('transition' in document.body.style) && ('webkitTransition' in document.body.style) ? 'webkitTransitionEnd' : 'transitionend',
      VENDOR = ['webkit', 'Moz'],
      columns = typeof opts.columns === 'number' ? parseInt(opts.columns) : 3,
      margin = typeof opts.margin === 'number' ? parseFloat(opts.margin) : 15,
      overviewActive = null,
      afterTransition,
      getStyleProperty = function(element, name) {
        if (!(name in element.style)) {
          var properName = name.charAt(0).toUpperCase() + name.substr(1);
          for (var i = 0, len = VENDOR.length; i < len; i++) {
            if (VENDOR[i] + properName in element.style) return VENDOR[i] + properName;
          }
        }
        return name;
      },
      getTransformScaleFactor = function(element, transformProp) {
        return parseFloat(element.style[transformProp].slice(6, -1));
      },
      getZoomFactor = function(element) {
        if ('zoom' in element.style) return parseFloat(element.style.zoom) || undefined;
      },
      getTransitionProperties = function(element) {
        var result = [],
          style = getComputedStyle(element),
          transitionProperty = style[getStyleProperty(element, 'transitionProperty')];
        if (!transitionProperty || RE_NONE.test(transitionProperty)) return result;
        // NOTE beyond this point, assume computed style returns compliant values
        transitionProperty = transitionProperty.split(RE_CSV);
        var transitionDuration = style[getStyleProperty(element, 'transitionDuration')].split(RE_CSV),
          transitionDelay = style[getStyleProperty(element, 'transitionDelay')].split(RE_CSV);
        transitionProperty.forEach(function(property, i) {
          if (transitionDuration[i] !== '0s' || transitionDelay[i] !== '0s') result.push(property);
        });
        return result;
      },
      flushStyle = function(element, property, from, to) {
        if (property) element.style[property] = from;
        element.offsetHeight; // jshint ignore: line
        if (property) element.style[property] = to;
      },
      onReady = function() {
        deck.on('activate', onReady)(); // unregisters listener
        deck.parent.scrollLeft = deck.parent.scrollTop = 0;
        if (!!opts.autostart || RE_MODE.test(location.search)) setTimeout(openOverview, 100); // timeout allows transitions to prepare
      },
      onSlideClick = function() {
        closeOverview(deck.slides.indexOf(this));
      },
      onNavigate = function(offset, e) {
        var targetIndex = e.index + offset;
        // IMPORTANT must use deck.slide to navigate and return false in order to circumvent bespoke-bullets behavior
        if (targetIndex >= 0 && targetIndex < deck.slides.length) deck.slide(targetIndex, { preview: true });
        return false;
      },
      onActivate = function(e) {
        if (e.scrollIntoView !== false) scrollSlideIntoView(e.slide, e.index, getZoomFactor(e.slide));
      },
      updateLocation = function(state) {
        var s = location.search.replace(RE_MODE, '').replace(/^[^?]/, '?$&');
        if (state) {
          history.replaceState(null, null, location.pathname + (s.length > 0 ? s + '&' : '?') + 'overview' + location.hash);
        }
        else {
          history.replaceState(null, null, location.pathname + s + location.hash);
        }
      },
      scrollSlideIntoView = function(slide, index, zoomFactor) {
        deck.parent.scrollTop = index < columns ? 0 : deck.parent.scrollTop + slide.getBoundingClientRect().top * (zoomFactor || 1);
      },
      removeAfterTransition = function(direction, parentClasses, slide, slideAlt) {
        slide.removeEventListener(TRANSITIONEND, afterTransition, false);
        if (slideAlt && slideAlt !== slide) slideAlt.removeEventListener(TRANSITIONEND, afterTransition, false);
        afterTransition = undefined;
        parentClasses.remove('bespoke-overview-' + direction);
      },
      getOrCreateTitle = function(parent) {
        var first = parent.firstElementChild;
        if (first.classList.contains('bespoke-title')) {
          first.style.width = '';
          return first;
        }
        var header = document.createElement('header');
        header.className = 'bespoke-title';
        header.style[getStyleProperty(header, 'transformOrigin')] = '0 0';
        var h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode(parent.getAttribute('data-title') || document.title));
        header.appendChild(h1);
        flushStyle(parent.insertBefore(header, first));
        return header;
      },
      openOverview = function() {
        var slides = deck.slides,
          parent = deck.parent,
          parentClasses = parent.classList,
          lastSlideIndex = slides.length - 1,
          activeSlideIndex = deck.slide(),
          sampleSlide = activeSlideIndex > 0 ? slides[0] : slides[lastSlideIndex],
          transformProp = getStyleProperty(sampleSlide, 'transform'),
          scaleParent = parent.querySelector('.bespoke-scale-parent'),
          baseScale = 1,
          zoomFactor,
          title,
          numTransitions = 0,
          resize = overviewActive,
          isWebKit = 'webkitAppearance' in parent.style;
        if (scaleParent) {
          baseScale = getTransformScaleFactor(scaleParent, transformProp);
        }
        else if ((zoomFactor = getZoomFactor(sampleSlide))) {
          baseScale = zoomFactor;
        }
        if (afterTransition) removeAfterTransition('from', parentClasses, slides[0], slides[lastSlideIndex]);
        if (!!opts.title) title = getOrCreateTitle(parent);
        if (!resize) {
          deck.slide(activeSlideIndex, { preview: true });
          parentClasses.add('bespoke-overview');
          addEventListener('resize', openOverview, false);
          overviewActive = [deck.on('activate', onActivate), deck.on('prev', onNavigate.bind(null, -1)), deck.on('next', onNavigate.bind(null, 1))];
          if (!!opts.counter) parentClasses.add('bespoke-overview-counter');
          if (!!opts.location) updateLocation(true);
          parentClasses.add('bespoke-overview-to');
          numTransitions = lastSlideIndex > 0 ? getTransitionProperties(sampleSlide).length :
              (getTransitionProperties(sampleSlide).join(' ').indexOf('transform') < 0 ? 0 : 1);
          parent.style.overflowY = 'scroll'; // gives us fine-grained control
          parent.style.scrollBehavior = 'smooth'; // not supported by all browsers
          if (isWebKit) slides.forEach(function(slide) { flushStyle(slide, 'marginBottom', '0%', ''); });
        }
        var deckWidth = parent.clientWidth / baseScale,
          deckHeight = parent.clientHeight / baseScale,
          scrollbarWidth = (scaleParent || parent).offsetWidth - parent.clientWidth,
          scrollbarOffset = scaleParent ? scrollbarWidth / 2 / baseScale : 0,
          slideWidth = sampleSlide.offsetWidth,
          slideHeight = sampleSlide.offsetHeight,
          scale = deckWidth / (columns * slideWidth + (columns + 1) * margin),
          totalScale = baseScale * scale,
          scaledSlideWidth = slideWidth * scale,
          scaledSlideHeight = slideHeight * scale,
          // NOTE x & y offset calculation based on transform origin at center of slide
          slideX = (deckWidth - scaledSlideWidth) / 2,
          slideY = (deckHeight - scaledSlideHeight) / 2,
          scaledMargin = margin * scale,
          scaledTitleHeight = 0,
          row = 0, col = 0;
        if (title) {
          if (opts.scaleTitle !== false) {
            title.style[zoomFactor ? 'zoom' : transformProp] = zoomFactor ? totalScale : 'scale(' + totalScale + ')';
            title.style.width = (parent.clientWidth / totalScale) + 'px';
            scaledTitleHeight = title.offsetHeight * scale;
          }
          else {
            if (scrollbarWidth > 0) title.style.width = parent.clientWidth + 'px';
            scaledTitleHeight = title.offsetHeight / baseScale;
          }
        }
        slides.forEach(function(slide) {
          var x = col * scaledSlideWidth + (col + 1) * scaledMargin - scrollbarOffset - slideX,
            y = row * scaledSlideHeight + (row + 1) * scaledMargin + scaledTitleHeight - slideY;
          // NOTE drop scientific notation for numbers near 0 as it confuses WebKit
          slide.style[transformProp] = 'translate(' + (x.toString().indexOf('e-') < 0 ? x : 0) + 'px, ' +
              (y.toString().indexOf('e-') < 0 ? y : 0) + 'px) scale(' + scale + ')';
          // NOTE add margin to last slide to leave gap below last row; only honored by WebKit
          if (row * columns + col === lastSlideIndex) slide.style.marginBottom = margin + 'px';
          slide.addEventListener('click', onSlideClick, false);
          if (col === (columns - 1)) {
            row += 1;
            col = 0;
          }
          else {
            col += 1;
          }
        });
        if (resize) {
          scrollSlideIntoView(slides[activeSlideIndex], activeSlideIndex, zoomFactor);
        }
        else if (numTransitions > 0) {
          sampleSlide.addEventListener(TRANSITIONEND, (afterTransition = function(e) {
            if (e.target === this && (numTransitions -= 1) === 0) {
              removeAfterTransition('to', parentClasses, this);
              if (isWebKit && parent.scrollHeight > parent.clientHeight) {
                flushStyle(parent, 'overflowY', 'auto', 'scroll'); // awakens scrollbar from zombie state
              }
              scrollSlideIntoView(slides[activeSlideIndex], activeSlideIndex, zoomFactor);
            }
          }), false);
        }
        else {
          slides.forEach(function(slide) { flushStyle(slide); }); // bypass transition, if any
          parentClasses.remove('bespoke-overview-to');
          scrollSlideIntoView(slides[activeSlideIndex], activeSlideIndex, zoomFactor);
        }
      },
      // NOTE the order of operation in this method is critical; heavily impacts behavior & transition smoothness
      closeOverview = function(selection) {
        // IMPORTANT intentionally reselect active slide to reactivate behavior
        deck.slide(typeof selection === 'number' ? selection : deck.slide(), { scrollIntoView: false });
        var slides = deck.slides,
          parent = deck.parent,
          parentClasses = parent.classList,
          lastSlideIndex = slides.length - 1,
          sampleSlide = deck.slide() > 0 ? slides[0] : slides[lastSlideIndex],
          transformProp = getStyleProperty(sampleSlide, 'transform'),
          transitionProp = getStyleProperty(sampleSlide, 'transition'),
          scaleParent = parent.querySelector('.bespoke-scale-parent'),
          baseScale,
          isWebKit = 'webkitAppearance' in parent.style;
        if (scaleParent) {
          baseScale = getTransformScaleFactor(scaleParent, transformProp);
        }
        else if (!(baseScale = getZoomFactor(sampleSlide))) {
          baseScale = 1;
        }
        if (afterTransition) removeAfterTransition('to', parentClasses, slides[0], slides[lastSlideIndex]);
        var yShift = parent.scrollTop / baseScale,
          // xShift accounts for horizontal shift when scrollbar is removed
          xShift = (parent.offsetWidth - (scaleParent || parent).clientWidth) / 2 / baseScale;
        parent.style.scrollBehavior = parent.style.overflowY = '';
        slides.forEach(function(slide) {
          if (isWebKit) flushStyle(slide, 'marginBottom', '0%', '');
          slide.removeEventListener('click', onSlideClick, false);
        });
        if (yShift || xShift) {
          slides.forEach(function(slide) {
            var m = slide.style[transformProp].match(RE_TRANS);
            slide.style[transformProp] = 'translate(' + (parseFloat(m[1]) - xShift) + 'px, ' + (parseFloat(m[2]) - yShift) + 'px) scale(' + m[3] + ')';
            flushStyle(slide, transitionProp, 'none', ''); // bypass transition, if any
          });
        }
        parent.scrollTop = 0;
        parentClasses.remove('bespoke-overview');
        removeEventListener('resize', openOverview, false);
        (overviewActive || []).forEach(function(unbindEvent) { unbindEvent(); });
        overviewActive = null;
        if (!!opts.counter) parentClasses.remove('bespoke-overview-counter');
        if (!!opts.location) updateLocation(false);
        parentClasses.add('bespoke-overview-from');
        var numTransitions = lastSlideIndex > 0 ? getTransitionProperties(sampleSlide).length :
            (getTransitionProperties(sampleSlide).join(' ').indexOf('transform') < 0 ? 0 : 1);
        slides.forEach(function(slide) { slide.style[transformProp] = ''; });
        if (numTransitions > 0) {
          sampleSlide.addEventListener(TRANSITIONEND, (afterTransition = function(e) {
            if (e.target === this && (numTransitions -= 1) === 0) removeAfterTransition('from', parentClasses, this);
          }), false);
        }
        else {
          slides.forEach(function(slide) { flushStyle(slide); }); // bypass transition, if any
          parentClasses.remove('bespoke-overview-from');
        }
      },
      toggleOverview = function() {
        overviewActive ? closeOverview() : openOverview(); // jshint ignore:line
      },
      onKeydown = function(e) {
        if (e.which === KEY_O) {
          if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) toggleOverview();
        }
        else if (overviewActive) {
          switch (e.which) {
            case KEY_ENT:
              if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) closeOverview();
              break;
            case KEY_UP:
              return onNavigate(-columns, { index: deck.slide() });
            case KEY_DN:
              return onNavigate(columns, { index: deck.slide() });
          }
        }
      };
    deck.on('activate', onReady);
    deck.on('destroy', function() {
      removeEventListener('resize', openOverview, false);
      document.removeEventListener('keydown', onKeydown, false);
    });
    deck.on('overview', toggleOverview);
    document.addEventListener('keydown', onKeydown, false);
  };
};

},{"insert-css":13}],9:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var parent = deck.parent,
      firstSlide = deck.slides[0],
      slideHeight = firstSlide.offsetHeight,
      slideWidth = firstSlide.offsetWidth,
      useZoom = options === 'zoom' || ('zoom' in parent.style && options !== 'transform'),

      wrap = function(element) {
        var wrapper = document.createElement('div');
        wrapper.className = 'bespoke-scale-parent';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        return wrapper;
      },

      elements = useZoom ? deck.slides : deck.slides.map(wrap),

      transformProperty = (function(property) {
        var prefixes = 'Moz Webkit O ms'.split(' ');
        return prefixes.reduce(function(currentProperty, prefix) {
            return prefix + property in parent.style ? prefix + property : currentProperty;
          }, property.toLowerCase());
      }('Transform')),

      scale = useZoom ?
        function(ratio, element) {
          element.style.zoom = ratio;
        } :
        function(ratio, element) {
          element.style[transformProperty] = 'scale(' + ratio + ')';
        },

      scaleAll = function() {
        var xScale = parent.offsetWidth / slideWidth,
          yScale = parent.offsetHeight / slideHeight;

        elements.forEach(scale.bind(null, Math.min(xScale, yScale)));
      };

    window.addEventListener('resize', scaleAll);
    scaleAll();
  };

};

},{}],10:[function(require,module,exports){
(function (global){
/*!
 * bespoke-theme-nebula v1.0.1
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 * 
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self);var f=o;f=f.bespoke||(f.bespoke={}),f=f.themes||(f.themes={}),f.nebula=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var classes = _dereq_('bespoke-classes');
var insertCss = _dereq_('insert-css');

module.exports = function() {
  var css = "/*! normalize.css v3.0.0 | MIT License | git.io/normalize */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b{font-weight:700}dfn{font-style:italic}h1{font-size:2em}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box}pre{overflow:auto}code,kbd,pre,samp{font-size:1em}kbd,pre,samp{font-family:monospace,monospace}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=\"checkbox\"],input[type=\"radio\"]{box-sizing:border-box;padding:0}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto}input[type=\"search\"]{-webkit-appearance:textfield;box-sizing:content-box}input[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th,*{padding:0}*{margin:0}html{-webkit-text-size-adjust:auto;-ms-text-size-adjust:auto;text-size-adjust:auto}.bespoke-parent{font-size:1.5em;background:#111;color:#ddd;font-family:futura,helvetica,arial,arial,sans-serif;overflow:hidden;text-align:center;-webkit-transition:background 1s ease;transition:background 1s ease;background-position:50% 50%}.bespoke-parent,.bespoke-scale-parent{position:absolute;top:0;left:0;right:0;bottom:0}.bespoke-scale-parent{pointer-events:none;z-index:1}.bespoke-scale-parent .bespoke-active{pointer-events:auto}.bespoke-slide{-webkit-transition:opacity .5s ease;transition:opacity .5s ease;width:940px;height:480px;position:absolute;top:50%;left:50%;margin-left:-470px;margin-top:-240px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;z-index:1}.bespoke-active{-webkit-transition-delay:.5s;transition-delay:.5s}.bespoke-active[data-bespoke-backdrop]{-webkit-transition-delay:.75s;transition-delay:.75s}.bespoke-inactive{opacity:0;pointer-events:none}.bespoke-backdrop{-webkit-transition:opacity 1s ease;position:absolute;top:0;left:0;right:0;bottom:0}.bespoke-progress-parent{position:absolute;top:0;left:0;right:0;height:.3vw;z-index:1}.bespoke-progress-bar{background:#ddd;position:absolute;top:0;left:0;height:100%;-webkit-transition:width 1s ease;transition:width 1s ease}.bespoke-bullet{-webkit-transition:opacity .3s ease;transition:opacity .3s ease}.bespoke-bullet-inactive{opacity:0}strong{font-weight:400}hr{width:50%;margin:1rem auto;height:1px;border:0;background:#ddd}h3,p,li{padding-left:20px;padding-right:20px}h3,h4,p,li,pre{font-weight:200}h1{line-height:1.4em;padding:1em;border:1px solid #ddd;border-left-width:0;border-right-width:0;min-width:8em}h1,h2{letter-spacing:.3em;text-transform:uppercase;font-weight:400;margin:.17em 0;position:relative}h2{line-height:1.1em;padding:0 0 0 .3em}h3{font-family:didot,times new roman,serif;font-style:italic;font-size:1.2em;line-height:1.6em;margin:.5em 0}h4{text-transform:uppercase;font-size:.8em;line-height:1.8em;letter-spacing:.3em;margin:1em 0}ul,ol{padding:0;margin:0;text-align:left}li{list-style:none;margin:.2em;font-style:normal;-webkit-transform:translateX(-6px);-ms-transform:translateX(-6px);transform:translateX(-6px)}li:before{content:'\\2014';margin-right:4px}pre{background:none!important}code{font-family:prestige elite std,consolas,courier new,monospace!important;font-style:normal;font-weight:200!important;text-align:left}a{padding-left:.3em;color:currentColor;text-decoration:none;border-bottom:1px solid currentColor}.emphatic{background:#f30}.single-words{word-spacing:9999px;line-height:2.9em;overflow:hidden}.bespoke-backdrop{opacity:0;-webkit-transition:opacity 1s ease,-webkit-transform 6s ease;transition:opacity 1s ease,transform 6s ease;background-size:cover;background-position:50% 50%;-webkit-transform:translateZ(0)scale(1.3);transform:translateZ(0)scale(1.3)}.bespoke-backdrop-active,.bespoke-backdrop-before{-webkit-transform:translateZ(0);transform:translateZ(0)}.bespoke-backdrop-before{-webkit-transition-delay:.2s;transition-delay:.2s}.bespoke-backdrop-active{opacity:.5}";
  insertCss(css, { prepend: true });

  return function(deck) {
    classes()(deck);
  };
};

},{"bespoke-classes":2,"insert-css":3}],2:[function(_dereq_,module,exports){
module.exports = function() {
  return function(deck) {
    var addClass = function(el, cls) {
        el.classList.add('bespoke-' + cls);
      },

      removeClass = function(el, cls) {
        el.className = el.className
          .replace(new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ')
          .trim();
      },

      deactivate = function(el, index) {
        var activeSlide = deck.slides[deck.slide()],
          offset = index - deck.slide(),
          offsetClass = offset > 0 ? 'after' : 'before';

        ['before(-\\d+)?', 'after(-\\d+)?', 'active', 'inactive'].map(removeClass.bind(null, el));

        if (el !== activeSlide) {
          ['inactive', offsetClass, offsetClass + '-' + Math.abs(offset)].map(addClass.bind(null, el));
        }
      };

    addClass(deck.parent, 'parent');
    deck.slides.map(function(el) { addClass(el, 'slide'); });

    deck.on('activate', function(e) {
      deck.slides.map(deactivate);
      addClass(e.slide, 'active');
      removeClass(e.slide, 'inactive');
    });
  };
};

},{}],3:[function(_dereq_,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}]},{},[1])
(1)
});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var axis = options == 'vertical' ? 'Y' : 'X',
      startPosition,
      delta;

    deck.parent.addEventListener('touchstart', function(e) {
      if (e.touches.length == 1) {
        startPosition = e.touches[0]['page' + axis];
        delta = 0;
      }
    });

    deck.parent.addEventListener('touchmove', function(e) {
      if (e.touches.length == 1) {
        e.preventDefault();
        delta = e.touches[0]['page' + axis] - startPosition;
      }
    });

    deck.parent.addEventListener('touchend', function() {
      if (Math.abs(delta) > 50) {
        deck[delta > 0 ? 'prev' : 'next']();
      }
    });
  };
};

},{}],12:[function(require,module,exports){
var from = function(opts, plugins) {
  var parent = (opts.parent || opts).nodeType === 1 ? (opts.parent || opts) : document.querySelector(opts.parent || opts),
    slides = [].filter.call(typeof opts.slides === 'string' ? parent.querySelectorAll(opts.slides) : (opts.slides || parent.children), function(el) { return el.nodeName !== 'SCRIPT'; }),
    activeSlide = slides[0],
    listeners = {},

    activate = function(index, customData) {
      if (!slides[index]) {
        return;
      }

      fire('deactivate', createEventData(activeSlide, customData));
      activeSlide = slides[index];
      fire('activate', createEventData(activeSlide, customData));
    },

    slide = function(index, customData) {
      if (arguments.length) {
        fire('slide', createEventData(slides[index], customData)) && activate(index, customData);
      } else {
        return slides.indexOf(activeSlide);
      }
    },

    step = function(offset, customData) {
      var slideIndex = slides.indexOf(activeSlide) + offset;

      fire(offset > 0 ? 'next' : 'prev', createEventData(activeSlide, customData)) && activate(slideIndex, customData);
    },

    on = function(eventName, callback) {
      (listeners[eventName] || (listeners[eventName] = [])).push(callback);
      return off.bind(null, eventName, callback);
    },

    off = function(eventName, callback) {
      listeners[eventName] = (listeners[eventName] || []).filter(function(listener) { return listener !== callback; });
    },

    fire = function(eventName, eventData) {
      return (listeners[eventName] || [])
        .reduce(function(notCancelled, callback) {
          return notCancelled && callback(eventData) !== false;
        }, true);
    },

    createEventData = function(el, eventData) {
      eventData = eventData || {};
      eventData.index = slides.indexOf(el);
      eventData.slide = el;
      return eventData;
    },

    deck = {
      on: on,
      off: off,
      fire: fire,
      slide: slide,
      next: step.bind(null, 1),
      prev: step.bind(null, -1),
      parent: parent,
      slides: slides
    };

  (plugins || []).forEach(function(plugin) {
    plugin(deck);
  });

  activate(0);

  return deck;
};

module.exports = {
  from: from
};

},{}],13:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],14:[function(require,module,exports){
var bespoke = require('bespoke'),
  nebula = require('bespoke-theme-nebula'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale'),
  backdrop = require('bespoke-backdrop'),
  overview = require('bespoke-overview'),
  onstage = require('bespoke-onstage'),
  hash = require('bespoke-hash');

var deck = bespoke.from('article', [
  nebula(),
  keys(),
  overview(),
  touch(),
  bullets('ul:not(.no-bullets) li, ol:not(.no-bullets) li, .bullet'),
  scale(),
  backdrop(),
  onstage(),
  hash()
]);

deck.on("activate", function(event) {
  console.log(event.index)
  if (event.slide.innerHTML.includes('asciinema')) {
    event.slide.getElementsByClassName('control-bar')[0].setAttribute('style', 'display:none')
    var click = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    var player = event.slide.getElementsByTagName('asciinema-player')[0]
    console.log('time', player.currentTime)
    player.currentTime = 0
    player.play()
  }

  if (event.slide.innerHTML.includes('video')) {
    var player = event.slide.getElementsByTagName('video')[0]
    player.currentTime = 0
    player.play()
  }

  // TODO reset gif
})

require("./../../bower_components/prism/prism.js");
require("./../../bower_components/prism-clojure/prism.clojure.js");

},{"./../../bower_components/prism-clojure/prism.clojure.js":1,"./../../bower_components/prism/prism.js":2,"bespoke":12,"bespoke-backdrop":3,"bespoke-bullets":4,"bespoke-hash":5,"bespoke-keys":6,"bespoke-onstage":7,"bespoke-overview":8,"bespoke-scale":9,"bespoke-theme-nebula":10,"bespoke-touch":11}]},{},[14])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhcnRlay9jb2RlL2NvbmZlcmVuY2VzLzIwMTkvZGV2LW9uLXByb2QvbXNhLW1lZXRpbmctMjAxOS0xMi0xMy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvYm93ZXJfY29tcG9uZW50cy9wcmlzbS1jbG9qdXJlL3ByaXNtLmNsb2p1cmUuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvYm93ZXJfY29tcG9uZW50cy9wcmlzbS9wcmlzbS5qcyIsIi9ob21lL2JhcnRlay9jb2RlL2NvbmZlcmVuY2VzLzIwMTkvZGV2LW9uLXByb2QvbXNhLW1lZXRpbmctMjAxOS0xMi0xMy9ub2RlX21vZHVsZXMvYmVzcG9rZS1iYWNrZHJvcC9saWIvYmVzcG9rZS1iYWNrZHJvcC5qcyIsIi9ob21lL2JhcnRlay9jb2RlL2NvbmZlcmVuY2VzLzIwMTkvZGV2LW9uLXByb2QvbXNhLW1lZXRpbmctMjAxOS0xMi0xMy9ub2RlX21vZHVsZXMvYmVzcG9rZS1idWxsZXRzL2xpYi9iZXNwb2tlLWJ1bGxldHMuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2UtaGFzaC9saWIvYmVzcG9rZS1oYXNoLmpzIiwiL2hvbWUvYmFydGVrL2NvZGUvY29uZmVyZW5jZXMvMjAxOS9kZXYtb24tcHJvZC9tc2EtbWVldGluZy0yMDE5LTEyLTEzL25vZGVfbW9kdWxlcy9iZXNwb2tlLWtleXMvbGliL2Jlc3Bva2Uta2V5cy5qcyIsIi9ob21lL2JhcnRlay9jb2RlL2NvbmZlcmVuY2VzLzIwMTkvZGV2LW9uLXByb2QvbXNhLW1lZXRpbmctMjAxOS0xMi0xMy9ub2RlX21vZHVsZXMvYmVzcG9rZS1vbnN0YWdlL2xpYi9iZXNwb2tlLW9uc3RhZ2UuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2Utb3ZlcnZpZXcvbGliL2Jlc3Bva2Utb3ZlcnZpZXcuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2Utc2NhbGUvbGliL2Jlc3Bva2Utc2NhbGUuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2UtdGhlbWUtbmVidWxhL2Rpc3QvYmVzcG9rZS10aGVtZS1uZWJ1bGEuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2UtdG91Y2gvbGliL2Jlc3Bva2UtdG91Y2guanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2Jlc3Bva2UvbGliL2Jlc3Bva2UuanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvbm9kZV9tb2R1bGVzL2luc2VydC1jc3MvaW5kZXguanMiLCIvaG9tZS9iYXJ0ZWsvY29kZS9jb25mZXJlbmNlcy8yMDE5L2Rldi1vbi1wcm9kL21zYS1tZWV0aW5nLTIwMTktMTItMTMvc3JjL3NjcmlwdHMvZmFrZV9hNWE4NWJiZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUHJpc20ubGFuZ3VhZ2VzLmNsb2p1cmUgPSB7XG4gICAgJ2NvbW1lbnQnOiAvOztbXlxcclxcbl0qKFxccj9cXG58JCkvZyxcbiAgICAnc3RyaW5nJzogLyhcIikoXFxcXD8uKSo/XFwxL2csXG4gICAgJ29wZXJhdG9yICc6IC8oOjp8Wzp8J10pXFxiW2EtekEtWl1bYS16QS1aMC05KishLV8/XSpcXGIvZywgLy91c2VkIGZvciBzeW1ib2xzIGFuZCBrZXl3b3Jkc1xuICAgICdrZXl3b3JkJzogL1xcYihkZWZ8aWZ8ZG98bGV0fHF1b3RlfHZhcnxmbnxsb29wfHJlY3VyfHRocm93fHRyeXxtb25pdG9yLWVudGVyfFxcLnxuZXd8c2V0IXxkZWZcXC18ZGVmbnxkZWZuXFwtfGRlZm1hY3JvfGRlZm11bHRpfGRlZm1ldGhvZHxkZWZzdHJ1Y3R8ZGVmb25jZXxkZWNsYXJlfGRlZmlubGluZXxkZWZpbnRlcmZhY2V8ZGVmcHJvdG9jb2x8ZGVmcmVjb3JkfGRlZnR5cGV8ZGVmcHJvamVjdHxuc3xcXCp8XFwrfFxcLXxcXC0+fFxcL3w8fDw9fD18PT18Pnw+PXxcXC5cXC58YWNjZXNzb3J8YWdlbnR8YWdlbnQtZXJyb3JzfGFnZXR8YWxlbmd0aHxhbGwtbnN8YWx0ZXJ8YW5kfGFwcGVuZC1jaGlsZHxhcHBseXxhcnJheS1tYXB8YXNldHxhc2V0LWJvb2xlYW58YXNldC1ieXRlfGFzZXQtY2hhcnxhc2V0LWRvdWJsZXxhc2V0LWZsb2F0fGFzZXQtaW50fGFzZXQtbG9uZ3xhc2V0LXNob3J0fGFzc2VydHxhc3NvY3xhd2FpdHxhd2FpdC1mb3J8YmVhbnxiaW5kaW5nfGJpdC1hbmR8Yml0LW5vdHxiaXQtb3J8Yml0LXNoaWZ0LWxlZnR8Yml0LXNoaWZ0LXJpZ2h0fGJpdC14b3J8Ym9vbGVhbnxicmFuY2hcXD98YnV0bGFzdHxieXRlfGNhc3R8Y2hhcnxjaGlsZHJlbnxjbGFzc3xjbGVhci1hZ2VudC1lcnJvcnN8Y29tbWVudHxjb21tdXRlfGNvbXB8Y29tcGFyYXRvcnxjb21wbGVtZW50fGNvbmNhdHxjb25qfGNvbnN8Y29uc3RhbnRseXxjb25kfGlmLW5vdHxjb25zdHJ1Y3QtcHJveHl8Y29udGFpbnNcXD98Y291bnR8Y3JlYXRlLW5zfGNyZWF0ZS1zdHJ1Y3R8Y3ljbGV8ZGVjfGRlcmVmfGRpZmZlcmVuY2V8ZGlzanxkaXNzb2N8ZGlzdGluY3R8ZG9hbGx8ZG9jfGRvcnVufGRvc2VxfGRvc3luY3xkb3RpbWVzfGRvdG98ZG91YmxlfGRvd258ZHJvcHxkcm9wLXdoaWxlfGVkaXR8ZW5kXFw/fGVuc3VyZXxldmFsfGV2ZXJ5XFw/fGZhbHNlXFw/fGZmaXJzdHxmaWxlLXNlcXxmaWx0ZXJ8ZmluZHxmaW5kLWRvY3xmaW5kLW5zfGZpbmQtdmFyfGZpcnN0fGZsb2F0fGZsdXNofGZvcnxmbnNlcXxmcmVzdHxnZW5zeW18Z2V0LXByb3h5LWNsYXNzfGdldHxoYXNoLW1hcHxoYXNoLXNldHxpZGVudGljYWxcXD98aWRlbnRpdHl8aWYtbGV0fGltcG9ydHxpbi1uc3xpbmN8aW5kZXh8aW5zZXJ0LWNoaWxkfGluc2VydC1sZWZ0fGluc2VydC1yaWdodHxpbnNwZWN0LXRhYmxlfGluc3BlY3QtdHJlZXxpbnN0YW5jZVxcP3xpbnR8aW50ZXJsZWF2ZXxpbnRlcnNlY3Rpb258aW50b3xpbnRvLWFycmF5fGl0ZXJhdGV8am9pbnxrZXl8a2V5c3xrZXl3b3JkfGtleXdvcmRcXD98bGFzdHxsYXp5LWNhdHxsYXp5LWNvbnN8bGVmdHxsZWZ0c3xsaW5lLXNlcXxsaXN0XFwqfGxpc3R8bG9hZHxsb2FkLWZpbGV8bG9ja2luZ3xsb25nfGxvb3B8bWFjcm9leHBhbmR8bWFjcm9leHBhbmQtMXxtYWtlLWFycmF5fG1ha2Utbm9kZXxtYXB8bWFwLWludmVydHxtYXBcXD98bWFwY2F0fG1heHxtYXgta2V5fG1lbWZufG1lcmdlfG1lcmdlLXdpdGh8bWV0YXxtaW58bWluLWtleXxuYW1lfG5hbWVzcGFjZXxuZWdcXD98bmV3fG5ld2xpbmV8bmV4dHxuaWxcXD98bm9kZXxub3R8bm90LWFueVxcP3xub3QtZXZlcnlcXD98bm90PXxucy1pbXBvcnRzfG5zLWludGVybnN8bnMtbWFwfG5zLW5hbWV8bnMtcHVibGljc3xucy1yZWZlcnN8bnMtcmVzb2x2ZXxucy11bm1hcHxudGh8bnRocmVzdHxvcnxwYXJzZXxwYXJ0aWFsfHBhdGh8cGVla3xwb3B8cG9zXFw/fHByfHByLXN0cnxwcmludHxwcmludC1zdHJ8cHJpbnRsbnxwcmludGxuLXN0cnxwcm58cHJuLXN0cnxwcm9qZWN0fHByb3h5fHByb3h5LW1hcHBpbmdzfHF1b3R8cmFuZHxyYW5kLWludHxyYW5nZXxyZS1maW5kfHJlLWdyb3Vwc3xyZS1tYXRjaGVyfHJlLW1hdGNoZXN8cmUtcGF0dGVybnxyZS1zZXF8cmVhZHxyZWFkLWxpbmV8cmVkdWNlfHJlZnxyZWYtc2V0fHJlZmVyfHJlbXxyZW1vdmV8cmVtb3ZlLW1ldGhvZHxyZW1vdmUtbnN8cmVuYW1lfHJlbmFtZS1rZXlzfHJlcGVhdHxyZXBsYWNlfHJlcGxpY2F0ZXxyZXNvbHZlfHJlc3R8cmVzdWx0c2V0LXNlcXxyZXZlcnNlfHJmaXJzdHxyaWdodHxyaWdodHN8cm9vdHxycmVzdHxyc2VxfHNlY29uZHxzZWxlY3R8c2VsZWN0LWtleXN8c2VuZHxzZW5kLW9mZnxzZXF8c2VxLXppcHxzZXFcXD98c2V0fHNob3J0fHNsdXJwfHNvbWV8c29ydHxzb3J0LWJ5fHNvcnRlZC1tYXB8c29ydGVkLW1hcC1ieXxzb3J0ZWQtc2V0fHNwZWNpYWwtc3ltYm9sXFw/fHNwbGl0LWF0fHNwbGl0LXdpdGh8c3RyfHN0cmluZ1xcP3xzdHJ1Y3R8c3RydWN0LW1hcHxzdWJzfHN1YnZlY3xzeW1ib2x8c3ltYm9sXFw/fHN5bmN8dGFrZXx0YWtlLW50aHx0YWtlLXdoaWxlfHRlc3R8dGltZXx0by1hcnJheXx0by1hcnJheS0yZHx0cmVlLXNlcXx0cnVlXFw/fHVuaW9ufHVwfHVwZGF0ZS1wcm94eXx2YWx8dmFsc3x2YXItZ2V0fHZhci1zZXR8dmFyXFw/fHZlY3Rvcnx2ZWN0b3ItemlwfHZlY3RvclxcP3x3aGVufHdoZW4tZmlyc3R8d2hlbi1sZXR8d2hlbi1ub3R8d2l0aC1sb2NhbC12YXJzfHdpdGgtbWV0YXx3aXRoLW9wZW58d2l0aC1vdXQtc3RyfHhtbC1zZXF8eG1sLXppcHx6ZXJvXFw/fHppcG1hcHx6aXBwZXIpXFxiL2csXG4gICAgJ2Jvb2xlYW4nOiAvXFxiKHRydWV8ZmFsc2UpXFxiL2csXG4gICAgJ251bWJlcic6IC9cXGItPygweCk/XFxkKlxcLj9cXGQrXFxiL2csXG4gICAgJ3B1bmN0dWF0aW9uJzogL1t7fVxcW1xcXSgpLF0vZ1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jb3JlLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbnZhciBfc2VsZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcblx0PyB3aW5kb3cgICAvLyBpZiBpbiBicm93c2VyXG5cdDogKFxuXHRcdCh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSlcblx0XHQ/IHNlbGYgLy8gaWYgaW4gd29ya2VyXG5cdFx0OiB7fSAgIC8vIGlmIGluIG5vZGUganNcblx0KTtcblxuLyoqXG4gKiBQcmlzbTogTGlnaHR3ZWlnaHQsIHJvYnVzdCwgZWxlZ2FudCBzeW50YXggaGlnaGxpZ2h0aW5nXG4gKiBNSVQgbGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocC9cbiAqIEBhdXRob3IgTGVhIFZlcm91IGh0dHA6Ly9sZWEudmVyb3UubWVcbiAqL1xuXG52YXIgUHJpc20gPSAoZnVuY3Rpb24oKXtcblxuLy8gUHJpdmF0ZSBoZWxwZXIgdmFyc1xudmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oXFx3KylcXGIvaTtcbnZhciB1bmlxdWVJZCA9IDA7XG5cbnZhciBfID0gX3NlbGYuUHJpc20gPSB7XG5cdHV0aWw6IHtcblx0XHRlbmNvZGU6IGZ1bmN0aW9uICh0b2tlbnMpIHtcblx0XHRcdGlmICh0b2tlbnMgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFRva2VuKHRva2Vucy50eXBlLCBfLnV0aWwuZW5jb2RlKHRva2Vucy5jb250ZW50KSwgdG9rZW5zLmFsaWFzKTtcblx0XHRcdH0gZWxzZSBpZiAoXy51dGlsLnR5cGUodG9rZW5zKSA9PT0gJ0FycmF5Jykge1xuXHRcdFx0XHRyZXR1cm4gdG9rZW5zLm1hcChfLnV0aWwuZW5jb2RlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0eXBlOiBmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXFxbb2JqZWN0IChcXHcrKVxcXS8pWzFdO1xuXHRcdH0sXG5cblx0XHRvYmpJZDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYgKCFvYmpbJ19faWQnXSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAnX19pZCcsIHsgdmFsdWU6ICsrdW5pcXVlSWQgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqWydfX2lkJ107XG5cdFx0fSxcblxuXHRcdC8vIERlZXAgY2xvbmUgYSBsYW5ndWFnZSBkZWZpbml0aW9uIChlLmcuIHRvIGV4dGVuZCBpdClcblx0XHRjbG9uZTogZnVuY3Rpb24gKG8pIHtcblx0XHRcdHZhciB0eXBlID0gXy51dGlsLnR5cGUobyk7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0XHRcdHZhciBjbG9uZSA9IHt9O1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIG8pIHtcblx0XHRcdFx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmVba2V5XSA9IF8udXRpbC5jbG9uZShvW2tleV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBjbG9uZTtcblxuXHRcdFx0XHRjYXNlICdBcnJheSc6XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIGV4aXN0ZW5jZSBmb3IgSUU4XG5cdFx0XHRcdFx0cmV0dXJuIG8ubWFwICYmIG8ubWFwKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIF8udXRpbC5jbG9uZSh2KTsgfSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvO1xuXHRcdH1cblx0fSxcblxuXHRsYW5ndWFnZXM6IHtcblx0XHRleHRlbmQ6IGZ1bmN0aW9uIChpZCwgcmVkZWYpIHtcblx0XHRcdHZhciBsYW5nID0gXy51dGlsLmNsb25lKF8ubGFuZ3VhZ2VzW2lkXSk7XG5cblx0XHRcdGZvciAodmFyIGtleSBpbiByZWRlZikge1xuXHRcdFx0XHRsYW5nW2tleV0gPSByZWRlZltrZXldO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGFuZztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSW5zZXJ0IGEgdG9rZW4gYmVmb3JlIGFub3RoZXIgdG9rZW4gaW4gYSBsYW5ndWFnZSBsaXRlcmFsXG5cdFx0ICogQXMgdGhpcyBuZWVkcyB0byByZWNyZWF0ZSB0aGUgb2JqZWN0ICh3ZSBjYW5ub3QgYWN0dWFsbHkgaW5zZXJ0IGJlZm9yZSBrZXlzIGluIG9iamVjdCBsaXRlcmFscyksXG5cdFx0ICogd2UgY2Fubm90IGp1c3QgcHJvdmlkZSBhbiBvYmplY3QsIHdlIG5lZWQgYW5vYmplY3QgYW5kIGEga2V5LlxuXHRcdCAqIEBwYXJhbSBpbnNpZGUgVGhlIGtleSAob3IgbGFuZ3VhZ2UgaWQpIG9mIHRoZSBwYXJlbnRcblx0XHQgKiBAcGFyYW0gYmVmb3JlIFRoZSBrZXkgdG8gaW5zZXJ0IGJlZm9yZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgZnVuY3Rpb24gYXBwZW5kcyBpbnN0ZWFkLlxuXHRcdCAqIEBwYXJhbSBpbnNlcnQgT2JqZWN0IHdpdGggdGhlIGtleS92YWx1ZSBwYWlycyB0byBpbnNlcnRcblx0XHQgKiBAcGFyYW0gcm9vdCBUaGUgb2JqZWN0IHRoYXQgY29udGFpbnMgYGluc2lkZWAuIElmIGVxdWFsIHRvIFByaXNtLmxhbmd1YWdlcywgaXQgY2FuIGJlIG9taXR0ZWQuXG5cdFx0ICovXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoaW5zaWRlLCBiZWZvcmUsIGluc2VydCwgcm9vdCkge1xuXHRcdFx0cm9vdCA9IHJvb3QgfHwgXy5sYW5ndWFnZXM7XG5cdFx0XHR2YXIgZ3JhbW1hciA9IHJvb3RbaW5zaWRlXTtcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuXHRcdFx0XHRpbnNlcnQgPSBhcmd1bWVudHNbMV07XG5cblx0XHRcdFx0Zm9yICh2YXIgbmV3VG9rZW4gaW4gaW5zZXJ0KSB7XG5cdFx0XHRcdFx0aWYgKGluc2VydC5oYXNPd25Qcm9wZXJ0eShuZXdUb2tlbikpIHtcblx0XHRcdFx0XHRcdGdyYW1tYXJbbmV3VG9rZW5dID0gaW5zZXJ0W25ld1Rva2VuXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZ3JhbW1hcjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHJldCA9IHt9O1xuXG5cdFx0XHRmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cblx0XHRcdFx0aWYgKGdyYW1tYXIuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG5cblx0XHRcdFx0XHRpZiAodG9rZW4gPT0gYmVmb3JlKSB7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIG5ld1Rva2VuIGluIGluc2VydCkge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpbnNlcnQuaGFzT3duUHJvcGVydHkobmV3VG9rZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0W25ld1Rva2VuXSA9IGluc2VydFtuZXdUb2tlbl07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXRbdG9rZW5dID0gZ3JhbW1hclt0b2tlbl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVXBkYXRlIHJlZmVyZW5jZXMgaW4gb3RoZXIgbGFuZ3VhZ2UgZGVmaW5pdGlvbnNcblx0XHRcdF8ubGFuZ3VhZ2VzLkRGUyhfLmxhbmd1YWdlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHJvb3RbaW5zaWRlXSAmJiBrZXkgIT0gaW5zaWRlKSB7XG5cdFx0XHRcdFx0dGhpc1trZXldID0gcmV0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJvb3RbaW5zaWRlXSA9IHJldDtcblx0XHR9LFxuXG5cdFx0Ly8gVHJhdmVyc2UgYSBsYW5ndWFnZSBkZWZpbml0aW9uIHdpdGggRGVwdGggRmlyc3QgU2VhcmNoXG5cdFx0REZTOiBmdW5jdGlvbihvLCBjYWxsYmFjaywgdHlwZSwgdmlzaXRlZCkge1xuXHRcdFx0dmlzaXRlZCA9IHZpc2l0ZWQgfHwge307XG5cdFx0XHRmb3IgKHZhciBpIGluIG8pIHtcblx0XHRcdFx0aWYgKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKG8sIGksIG9baV0sIHR5cGUgfHwgaSk7XG5cblx0XHRcdFx0XHRpZiAoXy51dGlsLnR5cGUob1tpXSkgPT09ICdPYmplY3QnICYmICF2aXNpdGVkW18udXRpbC5vYmpJZChvW2ldKV0pIHtcblx0XHRcdFx0XHRcdHZpc2l0ZWRbXy51dGlsLm9iaklkKG9baV0pXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRfLmxhbmd1YWdlcy5ERlMob1tpXSwgY2FsbGJhY2ssIG51bGwsIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChfLnV0aWwudHlwZShvW2ldKSA9PT0gJ0FycmF5JyAmJiAhdmlzaXRlZFtfLnV0aWwub2JqSWQob1tpXSldKSB7XG5cdFx0XHRcdFx0XHR2aXNpdGVkW18udXRpbC5vYmpJZChvW2ldKV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0Xy5sYW5ndWFnZXMuREZTKG9baV0sIGNhbGxiYWNrLCBpLCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHBsdWdpbnM6IHt9LFxuXG5cdGhpZ2hsaWdodEFsbDogZnVuY3Rpb24oYXN5bmMsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGVudiA9IHtcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFjayxcblx0XHRcdHNlbGVjdG9yOiAnY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sIFtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gY29kZSwgY29kZVtjbGFzcyo9XCJsYW5nLVwiXSwgW2NsYXNzKj1cImxhbmctXCJdIGNvZGUnXG5cdFx0fTtcblxuXHRcdF8uaG9va3MucnVuKFwiYmVmb3JlLWhpZ2hsaWdodGFsbFwiLCBlbnYpO1xuXG5cdFx0dmFyIGVsZW1lbnRzID0gZW52LmVsZW1lbnRzIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZW52LnNlbGVjdG9yKTtcblxuXHRcdGZvciAodmFyIGk9MCwgZWxlbWVudDsgZWxlbWVudCA9IGVsZW1lbnRzW2krK107KSB7XG5cdFx0XHRfLmhpZ2hsaWdodEVsZW1lbnQoZWxlbWVudCwgYXN5bmMgPT09IHRydWUsIGVudi5jYWxsYmFjayk7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdC8vIEZpbmQgbGFuZ3VhZ2Vcblx0XHR2YXIgbGFuZ3VhZ2UsIGdyYW1tYXIsIHBhcmVudCA9IGVsZW1lbnQ7XG5cblx0XHR3aGlsZSAocGFyZW50ICYmICFsYW5nLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdGxhbmd1YWdlID0gKHBhcmVudC5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywnJ10pWzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRncmFtbWFyID0gXy5sYW5ndWFnZXNbbGFuZ3VhZ2VdO1xuXHRcdH1cblxuXHRcdC8vIFNldCBsYW5ndWFnZSBvbiB0aGUgZWxlbWVudCwgaWYgbm90IHByZXNlbnRcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXG5cdFx0Ly8gU2V0IGxhbmd1YWdlIG9uIHRoZSBwYXJlbnQsIGZvciBzdHlsaW5nXG5cdFx0cGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKC9wcmUvaS50ZXN0KHBhcmVudC5ub2RlTmFtZSkpIHtcblx0XHRcdHBhcmVudC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXHRcdH1cblxuXHRcdHZhciBjb2RlID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlLFxuXHRcdFx0Z3JhbW1hcjogZ3JhbW1hcixcblx0XHRcdGNvZGU6IGNvZGVcblx0XHR9O1xuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1zYW5pdHktY2hlY2snLCBlbnYpO1xuXG5cdFx0aWYgKCFlbnYuY29kZSB8fCAhZW52LmdyYW1tYXIpIHtcblx0XHRcdF8uaG9va3MucnVuKCdjb21wbGV0ZScsIGVudik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1oaWdobGlnaHQnLCBlbnYpO1xuXG5cdFx0aWYgKGFzeW5jICYmIF9zZWxmLldvcmtlcikge1xuXHRcdFx0dmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoXy5maWxlbmFtZSk7XG5cblx0XHRcdHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0ZW52LmhpZ2hsaWdodGVkQ29kZSA9IGV2dC5kYXRhO1xuXG5cdFx0XHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaW5zZXJ0JywgZW52KTtcblxuXHRcdFx0XHRlbnYuZWxlbWVudC5pbm5lckhUTUwgPSBlbnYuaGlnaGxpZ2h0ZWRDb2RlO1xuXG5cdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoZW52LmVsZW1lbnQpO1xuXHRcdFx0XHRfLmhvb2tzLnJ1bignYWZ0ZXItaGlnaGxpZ2h0JywgZW52KTtcblx0XHRcdFx0Xy5ob29rcy5ydW4oJ2NvbXBsZXRlJywgZW52KTtcblx0XHRcdH07XG5cblx0XHRcdHdvcmtlci5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdGxhbmd1YWdlOiBlbnYubGFuZ3VhZ2UsXG5cdFx0XHRcdGNvZGU6IGVudi5jb2RlLFxuXHRcdFx0XHRpbW1lZGlhdGVDbG9zZTogdHJ1ZVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGVudi5oaWdobGlnaHRlZENvZGUgPSBfLmhpZ2hsaWdodChlbnYuY29kZSwgZW52LmdyYW1tYXIsIGVudi5sYW5ndWFnZSk7XG5cblx0XHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaW5zZXJ0JywgZW52KTtcblxuXHRcdFx0ZW52LmVsZW1lbnQuaW5uZXJIVE1MID0gZW52LmhpZ2hsaWdodGVkQ29kZTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbGVtZW50KTtcblxuXHRcdFx0Xy5ob29rcy5ydW4oJ2FmdGVyLWhpZ2hsaWdodCcsIGVudik7XG5cdFx0XHRfLmhvb2tzLnJ1bignY29tcGxldGUnLCBlbnYpO1xuXHRcdH1cblx0fSxcblxuXHRoaWdobGlnaHQ6IGZ1bmN0aW9uICh0ZXh0LCBncmFtbWFyLCBsYW5ndWFnZSkge1xuXHRcdHZhciB0b2tlbnMgPSBfLnRva2VuaXplKHRleHQsIGdyYW1tYXIpO1xuXHRcdHJldHVybiBUb2tlbi5zdHJpbmdpZnkoXy51dGlsLmVuY29kZSh0b2tlbnMpLCBsYW5ndWFnZSk7XG5cdH0sXG5cblx0dG9rZW5pemU6IGZ1bmN0aW9uKHRleHQsIGdyYW1tYXIsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIFRva2VuID0gXy5Ub2tlbjtcblxuXHRcdHZhciBzdHJhcnIgPSBbdGV4dF07XG5cblx0XHR2YXIgcmVzdCA9IGdyYW1tYXIucmVzdDtcblxuXHRcdGlmIChyZXN0KSB7XG5cdFx0XHRmb3IgKHZhciB0b2tlbiBpbiByZXN0KSB7XG5cdFx0XHRcdGdyYW1tYXJbdG9rZW5dID0gcmVzdFt0b2tlbl07XG5cdFx0XHR9XG5cblx0XHRcdGRlbGV0ZSBncmFtbWFyLnJlc3Q7XG5cdFx0fVxuXG5cdFx0dG9rZW5sb29wOiBmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cdFx0XHRpZighZ3JhbW1hci5oYXNPd25Qcm9wZXJ0eSh0b2tlbikgfHwgIWdyYW1tYXJbdG9rZW5dKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcGF0dGVybnMgPSBncmFtbWFyW3Rva2VuXTtcblx0XHRcdHBhdHRlcm5zID0gKF8udXRpbC50eXBlKHBhdHRlcm5zKSA9PT0gXCJBcnJheVwiKSA/IHBhdHRlcm5zIDogW3BhdHRlcm5zXTtcblxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBwYXR0ZXJucy5sZW5ndGg7ICsraikge1xuXHRcdFx0XHR2YXIgcGF0dGVybiA9IHBhdHRlcm5zW2pdLFxuXHRcdFx0XHRcdGluc2lkZSA9IHBhdHRlcm4uaW5zaWRlLFxuXHRcdFx0XHRcdGxvb2tiZWhpbmQgPSAhIXBhdHRlcm4ubG9va2JlaGluZCxcblx0XHRcdFx0XHRncmVlZHkgPSAhIXBhdHRlcm4uZ3JlZWR5LFxuXHRcdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSAwLFxuXHRcdFx0XHRcdGFsaWFzID0gcGF0dGVybi5hbGlhcztcblxuXHRcdFx0XHRpZiAoZ3JlZWR5ICYmICFwYXR0ZXJuLnBhdHRlcm4uZ2xvYmFsKSB7XG5cdFx0XHRcdFx0Ly8gV2l0aG91dCB0aGUgZ2xvYmFsIGZsYWcsIGxhc3RJbmRleCB3b24ndCB3b3JrXG5cdFx0XHRcdFx0dmFyIGZsYWdzID0gcGF0dGVybi5wYXR0ZXJuLnRvU3RyaW5nKCkubWF0Y2goL1tpbXV5XSokLylbMF07XG5cdFx0XHRcdFx0cGF0dGVybi5wYXR0ZXJuID0gUmVnRXhwKHBhdHRlcm4ucGF0dGVybi5zb3VyY2UsIGZsYWdzICsgXCJnXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGF0dGVybiA9IHBhdHRlcm4ucGF0dGVybiB8fCBwYXR0ZXJuO1xuXG5cdFx0XHRcdC8vIERvbuKAmXQgY2FjaGUgbGVuZ3RoIGFzIGl0IGNoYW5nZXMgZHVyaW5nIHRoZSBsb29wXG5cdFx0XHRcdGZvciAodmFyIGk9MCwgcG9zID0gMDsgaTxzdHJhcnIubGVuZ3RoOyBwb3MgKz0gKHN0cmFycltpXS5tYXRjaGVkU3RyIHx8IHN0cmFycltpXSkubGVuZ3RoLCArK2kpIHtcblxuXHRcdFx0XHRcdHZhciBzdHIgPSBzdHJhcnJbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RyYXJyLmxlbmd0aCA+IHRleHQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHQvLyBTb21ldGhpbmcgd2VudCB0ZXJyaWJseSB3cm9uZywgQUJPUlQsIEFCT1JUIVxuXHRcdFx0XHRcdFx0YnJlYWsgdG9rZW5sb29wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChzdHIgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cGF0dGVybi5sYXN0SW5kZXggPSAwO1xuXG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHN0ciksXG5cdFx0XHRcdFx0ICAgIGRlbE51bSA9IDE7XG5cblx0XHRcdFx0XHQvLyBHcmVlZHkgcGF0dGVybnMgY2FuIG92ZXJyaWRlL3JlbW92ZSB1cCB0byB0d28gcHJldmlvdXNseSBtYXRjaGVkIHRva2Vuc1xuXHRcdFx0XHRcdGlmICghbWF0Y2ggJiYgZ3JlZWR5ICYmIGkgIT0gc3RyYXJyLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdHBhdHRlcm4ubGFzdEluZGV4ID0gcG9zO1xuXHRcdFx0XHRcdFx0bWF0Y2ggPSBwYXR0ZXJuLmV4ZWModGV4dCk7XG5cdFx0XHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgKGxvb2tiZWhpbmQgPyBtYXRjaFsxXS5sZW5ndGggOiAwKSxcblx0XHRcdFx0XHRcdCAgICB0byA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoLFxuXHRcdFx0XHRcdFx0ICAgIGsgPSBpLFxuXHRcdFx0XHRcdFx0ICAgIHAgPSBwb3M7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGxlbiA9IHN0cmFyci5sZW5ndGg7IGsgPCBsZW4gJiYgcCA8IHRvOyArK2spIHtcblx0XHRcdFx0XHRcdFx0cCArPSAoc3RyYXJyW2tdLm1hdGNoZWRTdHIgfHwgc3RyYXJyW2tdKS5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdC8vIE1vdmUgdGhlIGluZGV4IGkgdG8gdGhlIGVsZW1lbnQgaW4gc3RyYXJyIHRoYXQgaXMgY2xvc2VzdCB0byBmcm9tXG5cdFx0XHRcdFx0XHRcdGlmIChmcm9tID49IHApIHtcblx0XHRcdFx0XHRcdFx0XHQrK2k7XG5cdFx0XHRcdFx0XHRcdFx0cG9zID0gcDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdFx0ICogSWYgc3RyYXJyW2ldIGlzIGEgVG9rZW4sIHRoZW4gdGhlIG1hdGNoIHN0YXJ0cyBpbnNpZGUgYW5vdGhlciBUb2tlbiwgd2hpY2ggaXMgaW52YWxpZFxuXHRcdFx0XHRcdFx0ICogSWYgc3RyYXJyW2sgLSAxXSBpcyBncmVlZHkgd2UgYXJlIGluIGNvbmZsaWN0IHdpdGggYW5vdGhlciBncmVlZHkgcGF0dGVyblxuXHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRpZiAoc3RyYXJyW2ldIGluc3RhbmNlb2YgVG9rZW4gfHwgc3RyYXJyW2sgLSAxXS5ncmVlZHkpIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE51bWJlciBvZiB0b2tlbnMgdG8gZGVsZXRlIGFuZCByZXBsYWNlIHdpdGggdGhlIG5ldyBtYXRjaFxuXHRcdFx0XHRcdFx0ZGVsTnVtID0gayAtIGk7XG5cdFx0XHRcdFx0XHRzdHIgPSB0ZXh0LnNsaWNlKHBvcywgcCk7XG5cdFx0XHRcdFx0XHRtYXRjaC5pbmRleCAtPSBwb3M7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCFtYXRjaCkge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYobG9va2JlaGluZCkge1xuXHRcdFx0XHRcdFx0bG9va2JlaGluZExlbmd0aCA9IG1hdGNoWzFdLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgbG9va2JlaGluZExlbmd0aCxcblx0XHRcdFx0XHQgICAgbWF0Y2ggPSBtYXRjaFswXS5zbGljZShsb29rYmVoaW5kTGVuZ3RoKSxcblx0XHRcdFx0XHQgICAgdG8gPSBmcm9tICsgbWF0Y2gubGVuZ3RoLFxuXHRcdFx0XHRcdCAgICBiZWZvcmUgPSBzdHIuc2xpY2UoMCwgZnJvbSksXG5cdFx0XHRcdFx0ICAgIGFmdGVyID0gc3RyLnNsaWNlKHRvKTtcblxuXHRcdFx0XHRcdHZhciBhcmdzID0gW2ksIGRlbE51bV07XG5cblx0XHRcdFx0XHRpZiAoYmVmb3JlKSB7XG5cdFx0XHRcdFx0XHRhcmdzLnB1c2goYmVmb3JlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgd3JhcHBlZCA9IG5ldyBUb2tlbih0b2tlbiwgaW5zaWRlPyBfLnRva2VuaXplKG1hdGNoLCBpbnNpZGUpIDogbWF0Y2gsIGFsaWFzLCBtYXRjaCwgZ3JlZWR5KTtcblxuXHRcdFx0XHRcdGFyZ3MucHVzaCh3cmFwcGVkKTtcblxuXHRcdFx0XHRcdGlmIChhZnRlcikge1xuXHRcdFx0XHRcdFx0YXJncy5wdXNoKGFmdGVyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHN0cmFyciwgYXJncyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyYXJyO1xuXHR9LFxuXG5cdGhvb2tzOiB7XG5cdFx0YWxsOiB7fSxcblxuXHRcdGFkZDogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaG9va3MgPSBfLmhvb2tzLmFsbDtcblxuXHRcdFx0aG9va3NbbmFtZV0gPSBob29rc1tuYW1lXSB8fCBbXTtcblxuXHRcdFx0aG9va3NbbmFtZV0ucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblxuXHRcdHJ1bjogZnVuY3Rpb24gKG5hbWUsIGVudikge1xuXHRcdFx0dmFyIGNhbGxiYWNrcyA9IF8uaG9va3MuYWxsW25hbWVdO1xuXG5cdFx0XHRpZiAoIWNhbGxiYWNrcyB8fCAhY2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIGk9MCwgY2FsbGJhY2s7IGNhbGxiYWNrID0gY2FsbGJhY2tzW2krK107KSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVudik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgVG9rZW4gPSBfLlRva2VuID0gZnVuY3Rpb24odHlwZSwgY29udGVudCwgYWxpYXMsIG1hdGNoZWRTdHIsIGdyZWVkeSkge1xuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXHR0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXHR0aGlzLmFsaWFzID0gYWxpYXM7XG5cdC8vIENvcHkgb2YgdGhlIGZ1bGwgc3RyaW5nIHRoaXMgdG9rZW4gd2FzIGNyZWF0ZWQgZnJvbVxuXHR0aGlzLm1hdGNoZWRTdHIgPSBtYXRjaGVkU3RyIHx8IG51bGw7XG5cdHRoaXMuZ3JlZWR5ID0gISFncmVlZHk7XG59O1xuXG5Ub2tlbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihvLCBsYW5ndWFnZSwgcGFyZW50KSB7XG5cdGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0aWYgKF8udXRpbC50eXBlKG8pID09PSAnQXJyYXknKSB7XG5cdFx0cmV0dXJuIG8ubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBUb2tlbi5zdHJpbmdpZnkoZWxlbWVudCwgbGFuZ3VhZ2UsIG8pO1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0dmFyIGVudiA9IHtcblx0XHR0eXBlOiBvLnR5cGUsXG5cdFx0Y29udGVudDogVG9rZW4uc3RyaW5naWZ5KG8uY29udGVudCwgbGFuZ3VhZ2UsIHBhcmVudCksXG5cdFx0dGFnOiAnc3BhbicsXG5cdFx0Y2xhc3NlczogWyd0b2tlbicsIG8udHlwZV0sXG5cdFx0YXR0cmlidXRlczoge30sXG5cdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlLFxuXHRcdHBhcmVudDogcGFyZW50XG5cdH07XG5cblx0aWYgKGVudi50eXBlID09ICdjb21tZW50Jykge1xuXHRcdGVudi5hdHRyaWJ1dGVzWydzcGVsbGNoZWNrJ10gPSAndHJ1ZSc7XG5cdH1cblxuXHRpZiAoby5hbGlhcykge1xuXHRcdHZhciBhbGlhc2VzID0gXy51dGlsLnR5cGUoby5hbGlhcykgPT09ICdBcnJheScgPyBvLmFsaWFzIDogW28uYWxpYXNdO1xuXHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGVudi5jbGFzc2VzLCBhbGlhc2VzKTtcblx0fVxuXG5cdF8uaG9va3MucnVuKCd3cmFwJywgZW52KTtcblxuXHR2YXIgYXR0cmlidXRlcyA9ICcnO1xuXG5cdGZvciAodmFyIG5hbWUgaW4gZW52LmF0dHJpYnV0ZXMpIHtcblx0XHRhdHRyaWJ1dGVzICs9IChhdHRyaWJ1dGVzID8gJyAnIDogJycpICsgbmFtZSArICc9XCInICsgKGVudi5hdHRyaWJ1dGVzW25hbWVdIHx8ICcnKSArICdcIic7XG5cdH1cblxuXHRyZXR1cm4gJzwnICsgZW52LnRhZyArICcgY2xhc3M9XCInICsgZW52LmNsYXNzZXMuam9pbignICcpICsgJ1wiJyArIChhdHRyaWJ1dGVzID8gJyAnICsgYXR0cmlidXRlcyA6ICcnKSArICc+JyArIGVudi5jb250ZW50ICsgJzwvJyArIGVudi50YWcgKyAnPic7XG5cbn07XG5cbmlmICghX3NlbGYuZG9jdW1lbnQpIHtcblx0aWYgKCFfc2VsZi5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0Ly8gaW4gTm9kZS5qc1xuXHRcdHJldHVybiBfc2VsZi5QcmlzbTtcblx0fVxuIFx0Ly8gSW4gd29ya2VyXG5cdF9zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldnQpIHtcblx0XHR2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZ0LmRhdGEpLFxuXHRcdCAgICBsYW5nID0gbWVzc2FnZS5sYW5ndWFnZSxcblx0XHQgICAgY29kZSA9IG1lc3NhZ2UuY29kZSxcblx0XHQgICAgaW1tZWRpYXRlQ2xvc2UgPSBtZXNzYWdlLmltbWVkaWF0ZUNsb3NlO1xuXG5cdFx0X3NlbGYucG9zdE1lc3NhZ2UoXy5oaWdobGlnaHQoY29kZSwgXy5sYW5ndWFnZXNbbGFuZ10sIGxhbmcpKTtcblx0XHRpZiAoaW1tZWRpYXRlQ2xvc2UpIHtcblx0XHRcdF9zZWxmLmNsb3NlKCk7XG5cdFx0fVxuXHR9LCBmYWxzZSk7XG5cblx0cmV0dXJuIF9zZWxmLlByaXNtO1xufVxuXG4vL0dldCBjdXJyZW50IHNjcmlwdCBhbmQgaGlnaGxpZ2h0XG52YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCBbXS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpKS5wb3AoKTtcblxuaWYgKHNjcmlwdCkge1xuXHRfLmZpbGVuYW1lID0gc2NyaXB0LnNyYztcblxuXHRpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAmJiAhc2NyaXB0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYW51YWwnKSkge1xuXHRcdGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiKSB7XG5cdFx0XHRpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuXHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF8uaGlnaGxpZ2h0QWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KF8uaGlnaGxpZ2h0QWxsLCAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIF8uaGlnaGxpZ2h0QWxsKTtcblx0XHR9XG5cdH1cbn1cblxucmV0dXJuIF9zZWxmLlByaXNtO1xuXG59KSgpO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBQcmlzbTtcbn1cblxuLy8gaGFjayBmb3IgY29tcG9uZW50cyB0byB3b3JrIGNvcnJlY3RseSBpbiBub2RlLmpzXG5pZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0Z2xvYmFsLlByaXNtID0gUHJpc207XG59XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1tYXJrdXAuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCA9IHtcblx0J2NvbW1lbnQnOiAvPCEtLVtcXHdcXFddKj8tLT4vLFxuXHQncHJvbG9nJzogLzxcXD9bXFx3XFxXXSs/XFw/Pi8sXG5cdCdkb2N0eXBlJzogLzwhRE9DVFlQRVtcXHdcXFddKz8+L2ksXG5cdCdjZGF0YSc6IC88IVxcW0NEQVRBXFxbW1xcd1xcV10qP11dPi9pLFxuXHQndGFnJzoge1xuXHRcdHBhdHRlcm46IC88XFwvPyg/IVxcZClbXlxccz5cXC89JDxdKyg/OlxccytbXlxccz5cXC89XSsoPzo9KD86KFwifCcpKD86XFxcXFxcMXxcXFxcPyg/IVxcMSlbXFx3XFxXXSkqXFwxfFteXFxzJ1wiPj1dKykpPykqXFxzKlxcLz8+L2ksXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQndGFnJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXjxcXC8/W15cXHM+XFwvXSsvaSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J3B1bmN0dWF0aW9uJzogL148XFwvPy8sXG5cdFx0XHRcdFx0J25hbWVzcGFjZSc6IC9eW15cXHM+XFwvOl0rOi9cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCdhdHRyLXZhbHVlJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvPSg/OignfFwiKVtcXHdcXFddKj8oXFwxKXxbXlxccz5dKykvaSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J3B1bmN0dWF0aW9uJzogL1s9PlwiJ10vXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQncHVuY3R1YXRpb24nOiAvXFwvPz4vLFxuXHRcdFx0J2F0dHItbmFtZSc6IHtcblx0XHRcdFx0cGF0dGVybjogL1teXFxzPlxcL10rLyxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J25hbWVzcGFjZSc6IC9eW15cXHM+XFwvOl0rOi9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9LFxuXHQnZW50aXR5JzogLyYjP1tcXGRhLXpdezEsOH07L2lcbn07XG5cbi8vIFBsdWdpbiB0byBtYWtlIGVudGl0eSB0aXRsZSBzaG93IHRoZSByZWFsIGVudGl0eSwgaWRlYSBieSBSb21hbiBLb21hcm92XG5QcmlzbS5ob29rcy5hZGQoJ3dyYXAnLCBmdW5jdGlvbihlbnYpIHtcblxuXHRpZiAoZW52LnR5cGUgPT09ICdlbnRpdHknKSB7XG5cdFx0ZW52LmF0dHJpYnV0ZXNbJ3RpdGxlJ10gPSBlbnYuY29udGVudC5yZXBsYWNlKC8mYW1wOy8sICcmJyk7XG5cdH1cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMueG1sID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblByaXNtLmxhbmd1YWdlcy5odG1sID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblByaXNtLmxhbmd1YWdlcy5tYXRobWwgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuUHJpc20ubGFuZ3VhZ2VzLnN2ZyA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXA7XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jc3MuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuUHJpc20ubGFuZ3VhZ2VzLmNzcyA9IHtcblx0J2NvbW1lbnQnOiAvXFwvXFwqW1xcd1xcV10qP1xcKlxcLy8sXG5cdCdhdHJ1bGUnOiB7XG5cdFx0cGF0dGVybjogL0BbXFx3LV0rPy4qPyg7fCg/PVxccypcXHspKS9pLFxuXHRcdGluc2lkZToge1xuXHRcdFx0J3J1bGUnOiAvQFtcXHctXSsvXG5cdFx0XHQvLyBTZWUgcmVzdCBiZWxvd1xuXHRcdH1cblx0fSxcblx0J3VybCc6IC91cmxcXCgoPzooW1wiJ10pKFxcXFwoPzpcXHJcXG58W1xcd1xcV10pfCg/IVxcMSlbXlxcXFxcXHJcXG5dKSpcXDF8Lio/KVxcKS9pLFxuXHQnc2VsZWN0b3InOiAvW15cXHtcXH1cXHNdW15cXHtcXH07XSo/KD89XFxzKlxceykvLFxuXHQnc3RyaW5nJzoge1xuXHRcdHBhdHRlcm46IC8oXCJ8JykoXFxcXCg/OlxcclxcbnxbXFx3XFxXXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH0sXG5cdCdwcm9wZXJ0eSc6IC8oXFxifFxcQilbXFx3LV0rKD89XFxzKjopL2ksXG5cdCdpbXBvcnRhbnQnOiAvXFxCIWltcG9ydGFudFxcYi9pLFxuXHQnZnVuY3Rpb24nOiAvWy1hLXowLTldKyg/PVxcKCkvaSxcblx0J3B1bmN0dWF0aW9uJzogL1soKXt9OzpdL1xufTtcblxuUHJpc20ubGFuZ3VhZ2VzLmNzc1snYXRydWxlJ10uaW5zaWRlLnJlc3QgPSBQcmlzbS51dGlsLmNsb25lKFByaXNtLmxhbmd1YWdlcy5jc3MpO1xuXG5pZiAoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCkge1xuXHRQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdtYXJrdXAnLCAndGFnJywge1xuXHRcdCdzdHlsZSc6IHtcblx0XHRcdHBhdHRlcm46IC8oPHN0eWxlW1xcd1xcV10qPz4pW1xcd1xcV10qPyg/PTxcXC9zdHlsZT4pL2ksXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuY3NzLFxuXHRcdFx0YWxpYXM6ICdsYW5ndWFnZS1jc3MnXG5cdFx0fVxuXHR9KTtcblx0XG5cdFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ2luc2lkZScsICdhdHRyLXZhbHVlJywge1xuXHRcdCdzdHlsZS1hdHRyJzoge1xuXHRcdFx0cGF0dGVybjogL1xccypzdHlsZT0oXCJ8JykuKj9cXDEvaSxcblx0XHRcdGluc2lkZToge1xuXHRcdFx0XHQnYXR0ci1uYW1lJzoge1xuXHRcdFx0XHRcdHBhdHRlcm46IC9eXFxzKnN0eWxlL2ksXG5cdFx0XHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGVcblx0XHRcdFx0fSxcblx0XHRcdFx0J3B1bmN0dWF0aW9uJzogL15cXHMqPVxccypbJ1wiXXxbJ1wiXVxccyokLyxcblx0XHRcdFx0J2F0dHItdmFsdWUnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogLy4rL2ksXG5cdFx0XHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuY3NzXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhbGlhczogJ2xhbmd1YWdlLWNzcydcblx0XHR9XG5cdH0sIFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnKTtcbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jbGlrZS5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5QcmlzbS5sYW5ndWFnZXMuY2xpa2UgPSB7XG5cdCdjb21tZW50JzogW1xuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oXnxbXlxcXFxdKVxcL1xcKltcXHdcXFddKj9cXCpcXC8vLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhefFteXFxcXDpdKVxcL1xcLy4qLyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0XHR9XG5cdF0sXG5cdCdzdHJpbmcnOiB7XG5cdFx0cGF0dGVybjogLyhbXCInXSkoXFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH0sXG5cdCdjbGFzcy1uYW1lJzoge1xuXHRcdHBhdHRlcm46IC8oKD86XFxiKD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3x0cmFpdHxpbnN0YW5jZW9mfG5ldylcXHMrKXwoPzpjYXRjaFxccytcXCgpKVthLXowLTlfXFwuXFxcXF0rL2ksXG5cdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRpbnNpZGU6IHtcblx0XHRcdHB1bmN0dWF0aW9uOiAvKFxcLnxcXFxcKS9cblx0XHR9XG5cdH0sXG5cdCdrZXl3b3JkJzogL1xcYihpZnxlbHNlfHdoaWxlfGRvfGZvcnxyZXR1cm58aW58aW5zdGFuY2VvZnxmdW5jdGlvbnxuZXd8dHJ5fHRocm93fGNhdGNofGZpbmFsbHl8bnVsbHxicmVha3xjb250aW51ZSlcXGIvLFxuXHQnYm9vbGVhbic6IC9cXGIodHJ1ZXxmYWxzZSlcXGIvLFxuXHQnZnVuY3Rpb24nOiAvW2EtejAtOV9dKyg/PVxcKCkvaSxcblx0J251bWJlcic6IC9cXGItPyg/OjB4W1xcZGEtZl0rfFxcZCpcXC4/XFxkKyg/OmVbKy1dP1xcZCspPylcXGIvaSxcblx0J29wZXJhdG9yJzogLy0tP3xcXCtcXCs/fCE9Pz0/fDw9P3w+PT98PT0/PT98JiY/fFxcfFxcfD98XFw/fFxcKnxcXC98fnxcXF58JS8sXG5cdCdwdW5jdHVhdGlvbic6IC9be31bXFxdOygpLC46XS9cbn07XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1qYXZhc2NyaXB0LmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cblByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0ID0gUHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgnY2xpa2UnLCB7XG5cdCdrZXl3b3JkJzogL1xcYihhc3xhc3luY3xhd2FpdHxicmVha3xjYXNlfGNhdGNofGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZW51bXxleHBvcnR8ZXh0ZW5kc3xmaW5hbGx5fGZvcnxmcm9tfGZ1bmN0aW9ufGdldHxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHNldHxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKVxcYi8sXG5cdCdudW1iZXInOiAvXFxiLT8oMHhbXFxkQS1GYS1mXSt8MGJbMDFdK3wwb1swLTddK3xcXGQqXFwuP1xcZCsoW0VlXVsrLV0/XFxkKyk/fE5hTnxJbmZpbml0eSlcXGIvLFxuXHQvLyBBbGxvdyBmb3IgYWxsIG5vbi1BU0NJSSBjaGFyYWN0ZXJzIChTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjAwODQ0NClcblx0J2Z1bmN0aW9uJzogL1tfJGEtekEtWlxceEEwLVxcdUZGRkZdW18kYS16QS1aMC05XFx4QTAtXFx1RkZGRl0qKD89XFwoKS9pLFxuXHQnb3BlcmF0b3InOiAvLS0/fFxcK1xcKz98IT0/PT98PD0/fD49P3w9PT89P3wmJj98XFx8XFx8P3xcXD98XFwqXFwqP3xcXC98fnxcXF58JXxcXC57M30vXG59KTtcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnamF2YXNjcmlwdCcsICdrZXl3b3JkJywge1xuXHQncmVnZXgnOiB7XG5cdFx0cGF0dGVybjogLyhefFteL10pXFwvKD8hXFwvKShcXFsuKz9dfFxcXFwufFteL1xcXFxcXHJcXG5dKStcXC9bZ2lteXVdezAsNX0oPz1cXHMqKCR8W1xcclxcbiwuO30pXSkpLyxcblx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdGdyZWVkeTogdHJ1ZVxuXHR9XG59KTtcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnamF2YXNjcmlwdCcsICdzdHJpbmcnLCB7XG5cdCd0ZW1wbGF0ZS1zdHJpbmcnOiB7XG5cdFx0cGF0dGVybjogL2AoPzpcXFxcXFxcXHxcXFxcP1teXFxcXF0pKj9gLyxcblx0XHRncmVlZHk6IHRydWUsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQnaW50ZXJwb2xhdGlvbic6IHtcblx0XHRcdFx0cGF0dGVybjogL1xcJFxce1tefV0rXFx9Lyxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J2ludGVycG9sYXRpb24tcHVuY3R1YXRpb24nOiB7XG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiAvXlxcJFxce3xcXH0kLyxcblx0XHRcdFx0XHRcdGFsaWFzOiAncHVuY3R1YXRpb24nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZXN0OiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3N0cmluZyc6IC9bXFxzXFxTXSsvXG5cdFx0fVxuXHR9XG59KTtcblxuaWYgKFByaXNtLmxhbmd1YWdlcy5tYXJrdXApIHtcblx0UHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnbWFya3VwJywgJ3RhZycsIHtcblx0XHQnc2NyaXB0Jzoge1xuXHRcdFx0cGF0dGVybjogLyg8c2NyaXB0W1xcd1xcV10qPz4pW1xcd1xcV10qPyg/PTxcXC9zY3JpcHQ+KS9pLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQsXG5cdFx0XHRhbGlhczogJ2xhbmd1YWdlLWphdmFzY3JpcHQnXG5cdFx0fVxuXHR9KTtcbn1cblxuUHJpc20ubGFuZ3VhZ2VzLmpzID0gUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tZmlsZS1oaWdobGlnaHQuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0aWYgKHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyB8fCAhc2VsZi5QcmlzbSB8fCAhc2VsZi5kb2N1bWVudCB8fCAhZG9jdW1lbnQucXVlcnlTZWxlY3Rvcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHNlbGYuUHJpc20uZmlsZUhpZ2hsaWdodCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIEV4dGVuc2lvbnMgPSB7XG5cdFx0XHQnanMnOiAnamF2YXNjcmlwdCcsXG5cdFx0XHQncHknOiAncHl0aG9uJyxcblx0XHRcdCdyYic6ICdydWJ5Jyxcblx0XHRcdCdwczEnOiAncG93ZXJzaGVsbCcsXG5cdFx0XHQncHNtMSc6ICdwb3dlcnNoZWxsJyxcblx0XHRcdCdzaCc6ICdiYXNoJyxcblx0XHRcdCdiYXQnOiAnYmF0Y2gnLFxuXHRcdFx0J2gnOiAnYycsXG5cdFx0XHQndGV4JzogJ2xhdGV4J1xuXHRcdH07XG5cblx0XHRpZihBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkgeyAvLyBDaGVjayB0byBwcmV2ZW50IGVycm9yIGluIElFOFxuXHRcdFx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgncHJlW2RhdGEtc3JjXScpKS5mb3JFYWNoKGZ1bmN0aW9uIChwcmUpIHtcblx0XHRcdFx0dmFyIHNyYyA9IHByZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XG5cblx0XHRcdFx0dmFyIGxhbmd1YWdlLCBwYXJlbnQgPSBwcmU7XG5cdFx0XHRcdHZhciBsYW5nID0gL1xcYmxhbmcoPzp1YWdlKT8tKD8hXFwqKShcXHcrKVxcYi9pO1xuXHRcdFx0XHR3aGlsZSAocGFyZW50ICYmICFsYW5nLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdFx0XHRsYW5ndWFnZSA9IChwcmUuY2xhc3NOYW1lLm1hdGNoKGxhbmcpIHx8IFssICcnXSlbMV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWxhbmd1YWdlKSB7XG5cdFx0XHRcdFx0dmFyIGV4dGVuc2lvbiA9IChzcmMubWF0Y2goL1xcLihcXHcrKSQvKSB8fCBbLCAnJ10pWzFdO1xuXHRcdFx0XHRcdGxhbmd1YWdlID0gRXh0ZW5zaW9uc1tleHRlbnNpb25dIHx8IGV4dGVuc2lvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBjb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29kZScpO1xuXHRcdFx0XHRjb2RlLmNsYXNzTmFtZSA9ICdsYW5ndWFnZS0nICsgbGFuZ3VhZ2U7XG5cblx0XHRcdFx0cHJlLnRleHRDb250ZW50ID0gJyc7XG5cblx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9ICdMb2FkaW5n4oCmJztcblxuXHRcdFx0XHRwcmUuYXBwZW5kQ2hpbGQoY29kZSk7XG5cblx0XHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0XHRcdHhoci5vcGVuKCdHRVQnLCBzcmMsIHRydWUpO1xuXG5cdFx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPCA0MDAgJiYgeGhyLnJlc3BvbnNlVGV4dCkge1xuXHRcdFx0XHRcdFx0XHRjb2RlLnRleHRDb250ZW50ID0geGhyLnJlc3BvbnNlVGV4dDtcblxuXHRcdFx0XHRcdFx0XHRQcmlzbS5oaWdobGlnaHRFbGVtZW50KGNvZGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoeGhyLnN0YXR1cyA+PSA0MDApIHtcblx0XHRcdFx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9ICfinJYgRXJyb3IgJyArIHhoci5zdGF0dXMgKyAnIHdoaWxlIGZldGNoaW5nIGZpbGU6ICcgKyB4aHIuc3RhdHVzVGV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb2RlLnRleHRDb250ZW50ID0gJ+KcliBFcnJvcjogRmlsZSBkb2VzIG5vdCBleGlzdCBvciBpcyBlbXB0eSc7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHhoci5zZW5kKG51bGwpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH07XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHNlbGYuUHJpc20uZmlsZUhpZ2hsaWdodCk7XG5cbn0pKCk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGRlY2spIHtcbiAgICB2YXIgYmFja2Ryb3BzO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQmFja2Ryb3BGb3JTbGlkZShzbGlkZSkge1xuICAgICAgdmFyIGJhY2tkcm9wQXR0cmlidXRlID0gc2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWJlc3Bva2UtYmFja2Ryb3AnKTtcblxuICAgICAgaWYgKGJhY2tkcm9wQXR0cmlidXRlKSB7XG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBiYWNrZHJvcC5jbGFzc05hbWUgPSBiYWNrZHJvcEF0dHJpYnV0ZTtcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnYmVzcG9rZS1iYWNrZHJvcCcpO1xuICAgICAgICBkZWNrLnBhcmVudC5hcHBlbmRDaGlsZChiYWNrZHJvcCk7XG4gICAgICAgIHJldHVybiBiYWNrZHJvcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDbGFzc2VzKGVsKSB7XG4gICAgICBpZiAoZWwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gYmFja2Ryb3BzLmluZGV4T2YoZWwpLFxuICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGRlY2suc2xpZGUoKTtcblxuICAgICAgICByZW1vdmVDbGFzcyhlbCwgJ2FjdGl2ZScpO1xuICAgICAgICByZW1vdmVDbGFzcyhlbCwgJ2luYWN0aXZlJyk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCAnYmVmb3JlJyk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCAnYWZ0ZXInKTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgIGFkZENsYXNzKGVsLCAnaW5hY3RpdmUnKTtcbiAgICAgICAgICBhZGRDbGFzcyhlbCwgaW5kZXggPCBjdXJyZW50SW5kZXggPyAnYmVmb3JlJyA6ICdhZnRlcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkZENsYXNzKGVsLCAnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdiZXNwb2tlLWJhY2tkcm9wLScgKyBjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZENsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2Jlc3Bva2UtYmFja2Ryb3AtJyArIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgYmFja2Ryb3BzID0gZGVjay5zbGlkZXNcbiAgICAgIC5tYXAoY3JlYXRlQmFja2Ryb3BGb3JTbGlkZSk7XG5cbiAgICBkZWNrLm9uKCdhY3RpdmF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYmFja2Ryb3BzLmZvckVhY2godXBkYXRlQ2xhc3Nlcyk7XG4gICAgfSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihkZWNrKSB7XG4gICAgdmFyIGFjdGl2ZVNsaWRlSW5kZXgsXG4gICAgICBhY3RpdmVCdWxsZXRJbmRleCxcblxuICAgICAgYnVsbGV0cyA9IGRlY2suc2xpZGVzLm1hcChmdW5jdGlvbihzbGlkZSkge1xuICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgPyBvcHRpb25zIDogJ1tkYXRhLWJlc3Bva2UtYnVsbGV0XScpKSwgMCk7XG4gICAgICB9KSxcblxuICAgICAgbmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmV4dFNsaWRlSW5kZXggPSBhY3RpdmVTbGlkZUluZGV4ICsgMTtcblxuICAgICAgICBpZiAoYWN0aXZlU2xpZGVIYXNCdWxsZXRCeU9mZnNldCgxKSkge1xuICAgICAgICAgIGFjdGl2YXRlQnVsbGV0KGFjdGl2ZVNsaWRlSW5kZXgsIGFjdGl2ZUJ1bGxldEluZGV4ICsgMSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1bGxldHNbbmV4dFNsaWRlSW5kZXhdKSB7XG4gICAgICAgICAgYWN0aXZhdGVCdWxsZXQobmV4dFNsaWRlSW5kZXgsIDApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBwcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwcmV2U2xpZGVJbmRleCA9IGFjdGl2ZVNsaWRlSW5kZXggLSAxO1xuXG4gICAgICAgIGlmIChhY3RpdmVTbGlkZUhhc0J1bGxldEJ5T2Zmc2V0KC0xKSkge1xuICAgICAgICAgIGFjdGl2YXRlQnVsbGV0KGFjdGl2ZVNsaWRlSW5kZXgsIGFjdGl2ZUJ1bGxldEluZGV4IC0gMSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGJ1bGxldHNbcHJldlNsaWRlSW5kZXhdKSB7XG4gICAgICAgICAgYWN0aXZhdGVCdWxsZXQocHJldlNsaWRlSW5kZXgsIGJ1bGxldHNbcHJldlNsaWRlSW5kZXhdLmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBhY3RpdmF0ZUJ1bGxldCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgsIGJ1bGxldEluZGV4KSB7XG4gICAgICAgIGFjdGl2ZVNsaWRlSW5kZXggPSBzbGlkZUluZGV4O1xuICAgICAgICBhY3RpdmVCdWxsZXRJbmRleCA9IGJ1bGxldEluZGV4O1xuXG4gICAgICAgIGJ1bGxldHMuZm9yRWFjaChmdW5jdGlvbihzbGlkZSwgcykge1xuICAgICAgICAgIHNsaWRlLmZvckVhY2goZnVuY3Rpb24oYnVsbGV0LCBiKSB7XG4gICAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCgnYmVzcG9rZS1idWxsZXQnKTtcblxuICAgICAgICAgICAgaWYgKHMgPCBzbGlkZUluZGV4IHx8IHMgPT09IHNsaWRlSW5kZXggJiYgYiA8PSBidWxsZXRJbmRleCkge1xuICAgICAgICAgICAgICBidWxsZXQuY2xhc3NMaXN0LmFkZCgnYmVzcG9rZS1idWxsZXQtYWN0aXZlJyk7XG4gICAgICAgICAgICAgIGJ1bGxldC5jbGFzc0xpc3QucmVtb3ZlKCdiZXNwb2tlLWJ1bGxldC1pbmFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoJ2Jlc3Bva2UtYnVsbGV0LWluYWN0aXZlJyk7XG4gICAgICAgICAgICAgIGJ1bGxldC5jbGFzc0xpc3QucmVtb3ZlKCdiZXNwb2tlLWJ1bGxldC1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHMgPT09IHNsaWRlSW5kZXggJiYgYiA9PT0gYnVsbGV0SW5kZXgpIHtcbiAgICAgICAgICAgICAgYnVsbGV0LmNsYXNzTGlzdC5hZGQoJ2Jlc3Bva2UtYnVsbGV0LWN1cnJlbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ1bGxldC5jbGFzc0xpc3QucmVtb3ZlKCdiZXNwb2tlLWJ1bGxldC1jdXJyZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgYWN0aXZlU2xpZGVIYXNCdWxsZXRCeU9mZnNldCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICByZXR1cm4gYnVsbGV0c1thY3RpdmVTbGlkZUluZGV4XVthY3RpdmVCdWxsZXRJbmRleCArIG9mZnNldF0gIT09IHVuZGVmaW5lZDtcbiAgICAgIH07XG5cbiAgICBkZWNrLm9uKCduZXh0JywgbmV4dCk7XG4gICAgZGVjay5vbigncHJldicsIHByZXYpO1xuXG4gICAgZGVjay5vbignc2xpZGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICBhY3RpdmF0ZUJ1bGxldChlLmluZGV4LCAwKTtcbiAgICB9KTtcblxuICAgIGFjdGl2YXRlQnVsbGV0KDAsIDApO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbihkZWNrKSB7XG4gICAgdmFyIHBhcnNlSGFzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSxcbiAgICAgICAgc2xpZGVOdW1iZXJPck5hbWUgPSBwYXJzZUludChoYXNoLCAxMCk7XG5cbiAgICAgIGlmIChoYXNoKSB7XG4gICAgICAgIGlmIChzbGlkZU51bWJlck9yTmFtZSkge1xuICAgICAgICAgIGFjdGl2YXRlU2xpZGUoc2xpZGVOdW1iZXJPck5hbWUgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWNrLnNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uKHNsaWRlLCBpKSB7XG4gICAgICAgICAgICBpZiAoc2xpZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWJlc3Bva2UtaGFzaCcpID09PSBoYXNoKSB7XG4gICAgICAgICAgICAgIGFjdGl2YXRlU2xpZGUoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGFjdGl2YXRlU2xpZGUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgdmFyIGluZGV4VG9BY3RpdmF0ZSA9IC0xIDwgaW5kZXggJiYgaW5kZXggPCBkZWNrLnNsaWRlcy5sZW5ndGggPyBpbmRleCA6IDA7XG4gICAgICBpZiAoaW5kZXhUb0FjdGl2YXRlICE9PSBkZWNrLnNsaWRlKCkpIHtcbiAgICAgICAgZGVjay5zbGlkZShpbmRleFRvQWN0aXZhdGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcGFyc2VIYXNoKCk7XG5cbiAgICAgIGRlY2sub24oJ2FjdGl2YXRlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgc2xpZGVOYW1lID0gZS5zbGlkZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmVzcG9rZS1oYXNoJyk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gc2xpZGVOYW1lIHx8IGUuaW5kZXggKyAxO1xuICAgICAgfSk7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgcGFyc2VIYXNoKTtcbiAgICB9LCAwKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGRlY2spIHtcbiAgICB2YXIgaXNIb3Jpem9udGFsID0gb3B0aW9ucyAhPT0gJ3ZlcnRpY2FsJztcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS53aGljaCA9PSAzNCB8fCAvLyBQQUdFIERPV05cbiAgICAgICAgKGUud2hpY2ggPT0gMzIgJiYgIWUuc2hpZnRLZXkpIHx8IC8vIFNQQUNFIFdJVEhPVVQgU0hJRlRcbiAgICAgICAgKGlzSG9yaXpvbnRhbCAmJiBlLndoaWNoID09IDM5KSB8fCAvLyBSSUdIVFxuICAgICAgICAoIWlzSG9yaXpvbnRhbCAmJiBlLndoaWNoID09IDQwKSAvLyBET1dOXG4gICAgICApIHsgZGVjay5uZXh0KCk7IH1cblxuICAgICAgaWYgKGUud2hpY2ggPT0gMzMgfHwgLy8gUEFHRSBVUFxuICAgICAgICAoZS53aGljaCA9PSAzMiAmJiBlLnNoaWZ0S2V5KSB8fCAvLyBTUEFDRSArIFNISUZUXG4gICAgICAgIChpc0hvcml6b250YWwgJiYgZS53aGljaCA9PSAzNykgfHwgLy8gTEVGVFxuICAgICAgICAoIWlzSG9yaXpvbnRhbCAmJiBlLndoaWNoID09IDM4KSAvLyBVUFxuICAgICAgKSB7IGRlY2sucHJldigpOyB9XG4gICAgfSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGRlY2spIHtcbiAgICB2YXIgY2xpZW50cyA9IFtdLFxuICAgICAgY3VycmVudFN0ZXAgPSAwLFxuICAgICAgYnJvYWRjYXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaWVudHMuZm9yRWFjaChmdW5jdGlvbihjbGllbnQpIHtcbiAgICAgICAgICBjbGllbnQucG9zdE1lc3NhZ2UoWydDVVJTT1InLCAoZGVjay5zbGlkZSgpICsgMSkgKyAnLicgKyBjdXJyZW50U3RlcF0uam9pbignICcpLCAnKicpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRTdGVwcyA9IGZ1bmN0aW9uKHNsaWRlKSB7XG4gICAgICAgIHJldHVybiBkZWNrLnNsaWRlc1tzbGlkZV0ucXVlcnlTZWxlY3RvckFsbCgnLmJlc3Bva2UtYnVsbGV0JykubGVuZ3RoO1xuICAgICAgfSxcbiAgICAgIGhhc1N0ZXAgPSBmdW5jdGlvbihzbGlkZSwgc3RlcCkge1xuICAgICAgICByZXR1cm4gZ2V0U3RlcHMoc2xpZGUpID4gc3RlcDtcbiAgICAgIH0sXG4gICAgICBnZXRTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBidWxsZXRzID0gZGVjay5zbGlkZXNbZGVjay5zbGlkZSgpXS5xdWVyeVNlbGVjdG9yQWxsKCcuYmVzcG9rZS1idWxsZXQnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1bGxldHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAoYnVsbGV0c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2Jlc3Bva2UtYnVsbGV0LWN1cnJlbnQnKSkgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9LFxuICAgICAgb25NZXNzYWdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgYXJndiA9IGUuZGF0YS5zcGxpdCgnICcpO1xuICAgICAgICB2YXIgY2xpZW50ID0gZS5zb3VyY2U7XG4gICAgICAgIHN3aXRjaChhcmd2WzBdKSB7XG4gICAgICAgICAgY2FzZSAnUkVHSVNURVInOlxuICAgICAgICAgICAgY2xpZW50cy5wdXNoKGNsaWVudCk7XG4gICAgICAgICAgICBjbGllbnQucG9zdE1lc3NhZ2UoWydSRUdJU1RFUkVEJywgZW5jb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LnRpdGxlIHx8ICdVbnRpdGxlZCcpLCBkZWNrLnNsaWRlcy5sZW5ndGhdLmpvaW4oJyAnKSwgJyonKTtcbiAgICAgICAgICAgIGJyb2FkY2FzdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnRk9SV0FSRCc6XG4gICAgICAgICAgICBkZWNrLm5leHQoKTtcbiAgICAgICAgICAgIGN1cnJlbnRTdGVwID0gZ2V0U3RlcCgpO1xuICAgICAgICAgICAgYnJvYWRjYXN0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdCQUNLJzpcbiAgICAgICAgICAgIGRlY2sucHJldigpO1xuICAgICAgICAgICAgY3VycmVudFN0ZXAgPSBnZXRTdGVwKCk7XG4gICAgICAgICAgICBicm9hZGNhc3QoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1NUQVJUJzpcbiAgICAgICAgICAgIGRlY2suc2xpZGUoMCwgeyBwcmV2aWV3OiB0cnVlIH0pO1xuICAgICAgICAgICAgY3VycmVudFN0ZXAgPSAwO1xuICAgICAgICAgICAgYnJvYWRjYXN0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdFTkQnOlxuICAgICAgICAgICAgZGVjay5zbGlkZShkZWNrLnNsaWRlcy5sZW5ndGggLSAxLCB7IHByZXZpZXc6IHRydWUgfSk7XG4gICAgICAgICAgICBjdXJyZW50U3RlcCA9IDA7XG4gICAgICAgICAgICBicm9hZGNhc3QoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1NFVF9DVVJTT1InOlxuICAgICAgICAgICAgdmFyIGN1cnNvciA9IGFyZ3ZbMV0gfHwgJzEnLCBzbGlkZSwgc3RlcDtcbiAgICAgICAgICAgIGlmIChjdXJzb3IuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICAgICAgICB2YXIgY3Vyc29ydiA9IGN1cnNvci5zcGxpdCgnLicsIDIpLm1hcChmdW5jdGlvbihuKSB7IHJldHVybiB+fm47IH0pO1xuICAgICAgICAgICAgICBzbGlkZSA9IGN1cnNvcnZbMF07XG4gICAgICAgICAgICAgIHN0ZXAgPSBjdXJzb3J2WzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHNsaWRlID0gfn5jdXJzb3I7XG4gICAgICAgICAgICAgIHN0ZXAgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ZXAgPiAwICYmICFoYXNTdGVwKHNsaWRlIC0gMSwgc3RlcCkpIHtcbiAgICAgICAgICAgICAgc2xpZGUgKz0gMTtcbiAgICAgICAgICAgICAgc3RlcCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2xpZGUgPCAxKSB7XG4gICAgICAgICAgICAgIHNsaWRlID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNsaWRlID4gZGVjay5zbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHNsaWRlID0gZGVjay5zbGlkZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVE9ETyBpZiBzbGlkZS9zdGVwIG9ubHkgZGlmZmVycyBieSBhIHN1YnN0ZXAsIHVzZSBuZXh0KCkvcHJldigpIHRvIGdldCB0aGVyZVxuICAgICAgICAgICAgZGVjay5zbGlkZShzbGlkZSAtIDEsIHsgcHJldmlldzogdHJ1ZSB9KTtcbiAgICAgICAgICAgIC8vIEhBQ0sgc3RlcCB0aHJvdWdoIGJ1bGxldHNcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgaSsrKSBkZWNrLm5leHQoKTtcbiAgICAgICAgICAgIC8vY3VycmVudFN0ZXAgPSBnZXRTdGVwKCk7XG4gICAgICAgICAgICBjdXJyZW50U3RlcCA9IHN0ZXA7XG4gICAgICAgICAgICBicm9hZGNhc3QoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0dFVF9OT1RFUyc6XG4gICAgICAgICAgICB2YXIgbm9kZSA9IGRlY2suc2xpZGVzW2RlY2suc2xpZGUoKV0ucXVlcnlTZWxlY3RvcignW3JvbGU9bm90ZV0nKSxcbiAgICAgICAgICAgICAgY29udGVudCA9IG5vZGUgPyBlbmNvZGVVUklDb21wb25lbnQobm9kZS5pbm5lckhUTUwpIDogJyc7XG4gICAgICAgICAgICBjbGllbnQucG9zdE1lc3NhZ2UoWydOT1RFUycsIGNvbnRlbnRdLmpvaW4oJyAnKSwgJyonKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIGRlY2sub24oJ2Rlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1lc3NhZ2UsIGZhbHNlKTtcbiAgICB9KTtcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25NZXNzYWdlLCBmYWxzZSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIHJlcXVpcmUoJ2luc2VydC1jc3MnKSgnLmJlc3Bva2UtcGFyZW50LmJlc3Bva2Utb3ZlcnZpZXd7cG9pbnRlci1ldmVudHM6YXV0b30nICtcbiAgICAnLmJlc3Bva2Utb3ZlcnZpZXcgOm5vdChpbWcpe3BvaW50ZXItZXZlbnRzOm5vbmV9JyArXG4gICAgJy5iZXNwb2tlLW92ZXJ2aWV3IC5iZXNwb2tlLXNsaWRle29wYWNpdHk6MTt2aXNpYmlsaXR5OnZpc2libGU7Y3Vyc29yOnBvaW50ZXI7cG9pbnRlci1ldmVudHM6YXV0b30nICtcbiAgICAnLmJlc3Bva2Utb3ZlcnZpZXcgLmJlc3Bva2UtYWN0aXZle291dGxpbmU6NnB4IHNvbGlkICNjZmQ4ZGM7b3V0bGluZS1vZmZzZXQ6LTNweDstbW96LW91dGxpbmUtcmFkaXVzOjNweH0nICtcbiAgICAnLmJlc3Bva2Utb3ZlcnZpZXcgLmJlc3Bva2UtYnVsbGV0e29wYWNpdHk6MTt2aXNpYmlsaXR5OnZpc2libGV9JyArXG4gICAgJy5iZXNwb2tlLW92ZXJ2aWV3LWNvdW50ZXJ7Y291bnRlci1yZXNldDpvdmVydmlld30nICtcbiAgICAnLmJlc3Bva2Utb3ZlcnZpZXctY291bnRlciAuYmVzcG9rZS1zbGlkZTo6YWZ0ZXJ7Y291bnRlci1pbmNyZW1lbnQ6b3ZlcnZpZXc7Y29udGVudDpjb3VudGVyKG92ZXJ2aWV3KTtwb3NpdGlvbjphYnNvbHV0ZTtyaWdodDouNzVlbTtib3R0b206LjVlbTtmb250LXNpemU6MS4yNXJlbTtsaW5lLWhlaWdodDoxLjI1fScgK1xuICAgICcuYmVzcG9rZS10aXRsZXt2aXNpYmlsaXR5OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7d2lkdGg6MTAwJTtwb2ludGVyLWV2ZW50czphdXRvfScgK1xuICAgICcuYmVzcG9rZS10aXRsZSBoMXttYXJnaW46MDtmb250LXNpemU6MS42ZW07bGluZS1oZWlnaHQ6MS4yO3RleHQtYWxpZ246Y2VudGVyfScgK1xuICAgICcuYmVzcG9rZS1vdmVydmlldzpub3QoLmJlc3Bva2Utb3ZlcnZpZXctdG8pIC5iZXNwb2tlLXRpdGxle3Zpc2liaWxpdHk6dmlzaWJsZX0nICtcbiAgICAnLmJlc3Bva2Utb3ZlcnZpZXctdG8gLmJlc3Bva2UtYWN0aXZlLC5iZXNwb2tlLW92ZXJ2aWV3LWZyb20gLmJlc3Bva2UtYWN0aXZle3otaW5kZXg6MX0nLCB7IHByZXBlbmQ6IHRydWUgfSk7XG4gIHJldHVybiBmdW5jdGlvbihkZWNrKSB7XG4gICAgb3B0cyA9IHR5cGVvZiBvcHRzID09PSAnb2JqZWN0JyA/IG9wdHMgOiB7fTtcbiAgICB2YXIgS0VZX08gPSA3OSwgS0VZX0VOVCA9IDEzLCBLRVlfVVAgPSAzOCwgS0VZX0ROID0gNDAsXG4gICAgICBSRV9DU1YgPSAvLCAqLywgUkVfTk9ORSA9IC9ebm9uZSg/OiwgP25vbmUpKiQvLCBSRV9UUkFOUyA9IC9edHJhbnNsYXRlXFwoKC4rPylweCwgPyguKz8pcHhcXCkgc2NhbGVcXCgoLis/KVxcKSQvLCBSRV9NT0RFID0gLyheXFw/fCYpb3ZlcnZpZXcoPz0kfCYpLyxcbiAgICAgIFRSQU5TSVRJT05FTkQgPSAhKCd0cmFuc2l0aW9uJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlKSAmJiAoJ3dlYmtpdFRyYW5zaXRpb24nIGluIGRvY3VtZW50LmJvZHkuc3R5bGUpID8gJ3dlYmtpdFRyYW5zaXRpb25FbmQnIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgVkVORE9SID0gWyd3ZWJraXQnLCAnTW96J10sXG4gICAgICBjb2x1bW5zID0gdHlwZW9mIG9wdHMuY29sdW1ucyA9PT0gJ251bWJlcicgPyBwYXJzZUludChvcHRzLmNvbHVtbnMpIDogMyxcbiAgICAgIG1hcmdpbiA9IHR5cGVvZiBvcHRzLm1hcmdpbiA9PT0gJ251bWJlcicgPyBwYXJzZUZsb2F0KG9wdHMubWFyZ2luKSA6IDE1LFxuICAgICAgb3ZlcnZpZXdBY3RpdmUgPSBudWxsLFxuICAgICAgYWZ0ZXJUcmFuc2l0aW9uLFxuICAgICAgZ2V0U3R5bGVQcm9wZXJ0eSA9IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgaWYgKCEobmFtZSBpbiBlbGVtZW50LnN0eWxlKSkge1xuICAgICAgICAgIHZhciBwcm9wZXJOYW1lID0gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKDEpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBWRU5ET1IubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChWRU5ET1JbaV0gKyBwcm9wZXJOYW1lIGluIGVsZW1lbnQuc3R5bGUpIHJldHVybiBWRU5ET1JbaV0gKyBwcm9wZXJOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgIH0sXG4gICAgICBnZXRUcmFuc2Zvcm1TY2FsZUZhY3RvciA9IGZ1bmN0aW9uKGVsZW1lbnQsIHRyYW5zZm9ybVByb3ApIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZWxlbWVudC5zdHlsZVt0cmFuc2Zvcm1Qcm9wXS5zbGljZSg2LCAtMSkpO1xuICAgICAgfSxcbiAgICAgIGdldFpvb21GYWN0b3IgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmICgnem9vbScgaW4gZWxlbWVudC5zdHlsZSkgcmV0dXJuIHBhcnNlRmxvYXQoZWxlbWVudC5zdHlsZS56b29tKSB8fCB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgZ2V0VHJhbnNpdGlvblByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICAgICAgdHJhbnNpdGlvblByb3BlcnR5ID0gc3R5bGVbZ2V0U3R5bGVQcm9wZXJ0eShlbGVtZW50LCAndHJhbnNpdGlvblByb3BlcnR5JyldO1xuICAgICAgICBpZiAoIXRyYW5zaXRpb25Qcm9wZXJ0eSB8fCBSRV9OT05FLnRlc3QodHJhbnNpdGlvblByb3BlcnR5KSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgLy8gTk9URSBiZXlvbmQgdGhpcyBwb2ludCwgYXNzdW1lIGNvbXB1dGVkIHN0eWxlIHJldHVybnMgY29tcGxpYW50IHZhbHVlc1xuICAgICAgICB0cmFuc2l0aW9uUHJvcGVydHkgPSB0cmFuc2l0aW9uUHJvcGVydHkuc3BsaXQoUkVfQ1NWKTtcbiAgICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHN0eWxlW2dldFN0eWxlUHJvcGVydHkoZWxlbWVudCwgJ3RyYW5zaXRpb25EdXJhdGlvbicpXS5zcGxpdChSRV9DU1YpLFxuICAgICAgICAgIHRyYW5zaXRpb25EZWxheSA9IHN0eWxlW2dldFN0eWxlUHJvcGVydHkoZWxlbWVudCwgJ3RyYW5zaXRpb25EZWxheScpXS5zcGxpdChSRV9DU1YpO1xuICAgICAgICB0cmFuc2l0aW9uUHJvcGVydHkuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSwgaSkge1xuICAgICAgICAgIGlmICh0cmFuc2l0aW9uRHVyYXRpb25baV0gIT09ICcwcycgfHwgdHJhbnNpdGlvbkRlbGF5W2ldICE9PSAnMHMnKSByZXN1bHQucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGZsdXNoU3R5bGUgPSBmdW5jdGlvbihlbGVtZW50LCBwcm9wZXJ0eSwgZnJvbSwgdG8pIHtcbiAgICAgICAgaWYgKHByb3BlcnR5KSBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XSA9IGZyb207XG4gICAgICAgIGVsZW1lbnQub2Zmc2V0SGVpZ2h0OyAvLyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gICAgICAgIGlmIChwcm9wZXJ0eSkgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSB0bztcbiAgICAgIH0sXG4gICAgICBvblJlYWR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlY2sub24oJ2FjdGl2YXRlJywgb25SZWFkeSkoKTsgLy8gdW5yZWdpc3RlcnMgbGlzdGVuZXJcbiAgICAgICAgZGVjay5wYXJlbnQuc2Nyb2xsTGVmdCA9IGRlY2sucGFyZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgIGlmICghIW9wdHMuYXV0b3N0YXJ0IHx8IFJFX01PREUudGVzdChsb2NhdGlvbi5zZWFyY2gpKSBzZXRUaW1lb3V0KG9wZW5PdmVydmlldywgMTAwKTsgLy8gdGltZW91dCBhbGxvd3MgdHJhbnNpdGlvbnMgdG8gcHJlcGFyZVxuICAgICAgfSxcbiAgICAgIG9uU2xpZGVDbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbG9zZU92ZXJ2aWV3KGRlY2suc2xpZGVzLmluZGV4T2YodGhpcykpO1xuICAgICAgfSxcbiAgICAgIG9uTmF2aWdhdGUgPSBmdW5jdGlvbihvZmZzZXQsIGUpIHtcbiAgICAgICAgdmFyIHRhcmdldEluZGV4ID0gZS5pbmRleCArIG9mZnNldDtcbiAgICAgICAgLy8gSU1QT1JUQU5UIG11c3QgdXNlIGRlY2suc2xpZGUgdG8gbmF2aWdhdGUgYW5kIHJldHVybiBmYWxzZSBpbiBvcmRlciB0byBjaXJjdW12ZW50IGJlc3Bva2UtYnVsbGV0cyBiZWhhdmlvclxuICAgICAgICBpZiAodGFyZ2V0SW5kZXggPj0gMCAmJiB0YXJnZXRJbmRleCA8IGRlY2suc2xpZGVzLmxlbmd0aCkgZGVjay5zbGlkZSh0YXJnZXRJbmRleCwgeyBwcmV2aWV3OiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgb25BY3RpdmF0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc2Nyb2xsSW50b1ZpZXcgIT09IGZhbHNlKSBzY3JvbGxTbGlkZUludG9WaWV3KGUuc2xpZGUsIGUuaW5kZXgsIGdldFpvb21GYWN0b3IoZS5zbGlkZSkpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUxvY2F0aW9uID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgdmFyIHMgPSBsb2NhdGlvbi5zZWFyY2gucmVwbGFjZShSRV9NT0RFLCAnJykucmVwbGFjZSgvXlteP10vLCAnPyQmJyk7XG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIG51bGwsIGxvY2F0aW9uLnBhdGhuYW1lICsgKHMubGVuZ3RoID4gMCA/IHMgKyAnJicgOiAnPycpICsgJ292ZXJ2aWV3JyArIGxvY2F0aW9uLmhhc2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIG51bGwsIGxvY2F0aW9uLnBhdGhuYW1lICsgcyArIGxvY2F0aW9uLmhhc2gpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2Nyb2xsU2xpZGVJbnRvVmlldyA9IGZ1bmN0aW9uKHNsaWRlLCBpbmRleCwgem9vbUZhY3Rvcikge1xuICAgICAgICBkZWNrLnBhcmVudC5zY3JvbGxUb3AgPSBpbmRleCA8IGNvbHVtbnMgPyAwIDogZGVjay5wYXJlbnQuc2Nyb2xsVG9wICsgc2xpZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICogKHpvb21GYWN0b3IgfHwgMSk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlQWZ0ZXJUcmFuc2l0aW9uID0gZnVuY3Rpb24oZGlyZWN0aW9uLCBwYXJlbnRDbGFzc2VzLCBzbGlkZSwgc2xpZGVBbHQpIHtcbiAgICAgICAgc2xpZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9ORU5ELCBhZnRlclRyYW5zaXRpb24sIGZhbHNlKTtcbiAgICAgICAgaWYgKHNsaWRlQWx0ICYmIHNsaWRlQWx0ICE9PSBzbGlkZSkgc2xpZGVBbHQucmVtb3ZlRXZlbnRMaXN0ZW5lcihUUkFOU0lUSU9ORU5ELCBhZnRlclRyYW5zaXRpb24sIGZhbHNlKTtcbiAgICAgICAgYWZ0ZXJUcmFuc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICBwYXJlbnRDbGFzc2VzLnJlbW92ZSgnYmVzcG9rZS1vdmVydmlldy0nICsgZGlyZWN0aW9uKTtcbiAgICAgIH0sXG4gICAgICBnZXRPckNyZWF0ZVRpdGxlID0gZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgIHZhciBmaXJzdCA9IHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0LmNsYXNzTGlzdC5jb250YWlucygnYmVzcG9rZS10aXRsZScpKSB7XG4gICAgICAgICAgZmlyc3Quc3R5bGUud2lkdGggPSAnJztcbiAgICAgICAgICByZXR1cm4gZmlyc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpO1xuICAgICAgICBoZWFkZXIuY2xhc3NOYW1lID0gJ2Jlc3Bva2UtdGl0bGUnO1xuICAgICAgICBoZWFkZXIuc3R5bGVbZ2V0U3R5bGVQcm9wZXJ0eShoZWFkZXIsICd0cmFuc2Zvcm1PcmlnaW4nKV0gPSAnMCAwJztcbiAgICAgICAgdmFyIGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICAgICAgaDEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFyZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGRvY3VtZW50LnRpdGxlKSk7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChoMSk7XG4gICAgICAgIGZsdXNoU3R5bGUocGFyZW50Lmluc2VydEJlZm9yZShoZWFkZXIsIGZpcnN0KSk7XG4gICAgICAgIHJldHVybiBoZWFkZXI7XG4gICAgICB9LFxuICAgICAgb3Blbk92ZXJ2aWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzbGlkZXMgPSBkZWNrLnNsaWRlcyxcbiAgICAgICAgICBwYXJlbnQgPSBkZWNrLnBhcmVudCxcbiAgICAgICAgICBwYXJlbnRDbGFzc2VzID0gcGFyZW50LmNsYXNzTGlzdCxcbiAgICAgICAgICBsYXN0U2xpZGVJbmRleCA9IHNsaWRlcy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFjdGl2ZVNsaWRlSW5kZXggPSBkZWNrLnNsaWRlKCksXG4gICAgICAgICAgc2FtcGxlU2xpZGUgPSBhY3RpdmVTbGlkZUluZGV4ID4gMCA/IHNsaWRlc1swXSA6IHNsaWRlc1tsYXN0U2xpZGVJbmRleF0sXG4gICAgICAgICAgdHJhbnNmb3JtUHJvcCA9IGdldFN0eWxlUHJvcGVydHkoc2FtcGxlU2xpZGUsICd0cmFuc2Zvcm0nKSxcbiAgICAgICAgICBzY2FsZVBhcmVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuYmVzcG9rZS1zY2FsZS1wYXJlbnQnKSxcbiAgICAgICAgICBiYXNlU2NhbGUgPSAxLFxuICAgICAgICAgIHpvb21GYWN0b3IsXG4gICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgbnVtVHJhbnNpdGlvbnMgPSAwLFxuICAgICAgICAgIHJlc2l6ZSA9IG92ZXJ2aWV3QWN0aXZlLFxuICAgICAgICAgIGlzV2ViS2l0ID0gJ3dlYmtpdEFwcGVhcmFuY2UnIGluIHBhcmVudC5zdHlsZTtcbiAgICAgICAgaWYgKHNjYWxlUGFyZW50KSB7XG4gICAgICAgICAgYmFzZVNjYWxlID0gZ2V0VHJhbnNmb3JtU2NhbGVGYWN0b3Ioc2NhbGVQYXJlbnQsIHRyYW5zZm9ybVByb3ApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCh6b29tRmFjdG9yID0gZ2V0Wm9vbUZhY3RvcihzYW1wbGVTbGlkZSkpKSB7XG4gICAgICAgICAgYmFzZVNjYWxlID0gem9vbUZhY3RvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWZ0ZXJUcmFuc2l0aW9uKSByZW1vdmVBZnRlclRyYW5zaXRpb24oJ2Zyb20nLCBwYXJlbnRDbGFzc2VzLCBzbGlkZXNbMF0sIHNsaWRlc1tsYXN0U2xpZGVJbmRleF0pO1xuICAgICAgICBpZiAoISFvcHRzLnRpdGxlKSB0aXRsZSA9IGdldE9yQ3JlYXRlVGl0bGUocGFyZW50KTtcbiAgICAgICAgaWYgKCFyZXNpemUpIHtcbiAgICAgICAgICBkZWNrLnNsaWRlKGFjdGl2ZVNsaWRlSW5kZXgsIHsgcHJldmlldzogdHJ1ZSB9KTtcbiAgICAgICAgICBwYXJlbnRDbGFzc2VzLmFkZCgnYmVzcG9rZS1vdmVydmlldycpO1xuICAgICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9wZW5PdmVydmlldywgZmFsc2UpO1xuICAgICAgICAgIG92ZXJ2aWV3QWN0aXZlID0gW2RlY2sub24oJ2FjdGl2YXRlJywgb25BY3RpdmF0ZSksIGRlY2sub24oJ3ByZXYnLCBvbk5hdmlnYXRlLmJpbmQobnVsbCwgLTEpKSwgZGVjay5vbignbmV4dCcsIG9uTmF2aWdhdGUuYmluZChudWxsLCAxKSldO1xuICAgICAgICAgIGlmICghIW9wdHMuY291bnRlcikgcGFyZW50Q2xhc3Nlcy5hZGQoJ2Jlc3Bva2Utb3ZlcnZpZXctY291bnRlcicpO1xuICAgICAgICAgIGlmICghIW9wdHMubG9jYXRpb24pIHVwZGF0ZUxvY2F0aW9uKHRydWUpO1xuICAgICAgICAgIHBhcmVudENsYXNzZXMuYWRkKCdiZXNwb2tlLW92ZXJ2aWV3LXRvJyk7XG4gICAgICAgICAgbnVtVHJhbnNpdGlvbnMgPSBsYXN0U2xpZGVJbmRleCA+IDAgPyBnZXRUcmFuc2l0aW9uUHJvcGVydGllcyhzYW1wbGVTbGlkZSkubGVuZ3RoIDpcbiAgICAgICAgICAgICAgKGdldFRyYW5zaXRpb25Qcm9wZXJ0aWVzKHNhbXBsZVNsaWRlKS5qb2luKCcgJykuaW5kZXhPZigndHJhbnNmb3JtJykgPCAwID8gMCA6IDEpO1xuICAgICAgICAgIHBhcmVudC5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJzsgLy8gZ2l2ZXMgdXMgZmluZS1ncmFpbmVkIGNvbnRyb2xcbiAgICAgICAgICBwYXJlbnQuc3R5bGUuc2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJzsgLy8gbm90IHN1cHBvcnRlZCBieSBhbGwgYnJvd3NlcnNcbiAgICAgICAgICBpZiAoaXNXZWJLaXQpIHNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uKHNsaWRlKSB7IGZsdXNoU3R5bGUoc2xpZGUsICdtYXJnaW5Cb3R0b20nLCAnMCUnLCAnJyk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWNrV2lkdGggPSBwYXJlbnQuY2xpZW50V2lkdGggLyBiYXNlU2NhbGUsXG4gICAgICAgICAgZGVja0hlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQgLyBiYXNlU2NhbGUsXG4gICAgICAgICAgc2Nyb2xsYmFyV2lkdGggPSAoc2NhbGVQYXJlbnQgfHwgcGFyZW50KS5vZmZzZXRXaWR0aCAtIHBhcmVudC5jbGllbnRXaWR0aCxcbiAgICAgICAgICBzY3JvbGxiYXJPZmZzZXQgPSBzY2FsZVBhcmVudCA/IHNjcm9sbGJhcldpZHRoIC8gMiAvIGJhc2VTY2FsZSA6IDAsXG4gICAgICAgICAgc2xpZGVXaWR0aCA9IHNhbXBsZVNsaWRlLm9mZnNldFdpZHRoLFxuICAgICAgICAgIHNsaWRlSGVpZ2h0ID0gc2FtcGxlU2xpZGUub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIHNjYWxlID0gZGVja1dpZHRoIC8gKGNvbHVtbnMgKiBzbGlkZVdpZHRoICsgKGNvbHVtbnMgKyAxKSAqIG1hcmdpbiksXG4gICAgICAgICAgdG90YWxTY2FsZSA9IGJhc2VTY2FsZSAqIHNjYWxlLFxuICAgICAgICAgIHNjYWxlZFNsaWRlV2lkdGggPSBzbGlkZVdpZHRoICogc2NhbGUsXG4gICAgICAgICAgc2NhbGVkU2xpZGVIZWlnaHQgPSBzbGlkZUhlaWdodCAqIHNjYWxlLFxuICAgICAgICAgIC8vIE5PVEUgeCAmIHkgb2Zmc2V0IGNhbGN1bGF0aW9uIGJhc2VkIG9uIHRyYW5zZm9ybSBvcmlnaW4gYXQgY2VudGVyIG9mIHNsaWRlXG4gICAgICAgICAgc2xpZGVYID0gKGRlY2tXaWR0aCAtIHNjYWxlZFNsaWRlV2lkdGgpIC8gMixcbiAgICAgICAgICBzbGlkZVkgPSAoZGVja0hlaWdodCAtIHNjYWxlZFNsaWRlSGVpZ2h0KSAvIDIsXG4gICAgICAgICAgc2NhbGVkTWFyZ2luID0gbWFyZ2luICogc2NhbGUsXG4gICAgICAgICAgc2NhbGVkVGl0bGVIZWlnaHQgPSAwLFxuICAgICAgICAgIHJvdyA9IDAsIGNvbCA9IDA7XG4gICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgIGlmIChvcHRzLnNjYWxlVGl0bGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aXRsZS5zdHlsZVt6b29tRmFjdG9yID8gJ3pvb20nIDogdHJhbnNmb3JtUHJvcF0gPSB6b29tRmFjdG9yID8gdG90YWxTY2FsZSA6ICdzY2FsZSgnICsgdG90YWxTY2FsZSArICcpJztcbiAgICAgICAgICAgIHRpdGxlLnN0eWxlLndpZHRoID0gKHBhcmVudC5jbGllbnRXaWR0aCAvIHRvdGFsU2NhbGUpICsgJ3B4JztcbiAgICAgICAgICAgIHNjYWxlZFRpdGxlSGVpZ2h0ID0gdGl0bGUub2Zmc2V0SGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNjcm9sbGJhcldpZHRoID4gMCkgdGl0bGUuc3R5bGUud2lkdGggPSBwYXJlbnQuY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICAgICAgc2NhbGVkVGl0bGVIZWlnaHQgPSB0aXRsZS5vZmZzZXRIZWlnaHQgLyBiYXNlU2NhbGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uKHNsaWRlKSB7XG4gICAgICAgICAgdmFyIHggPSBjb2wgKiBzY2FsZWRTbGlkZVdpZHRoICsgKGNvbCArIDEpICogc2NhbGVkTWFyZ2luIC0gc2Nyb2xsYmFyT2Zmc2V0IC0gc2xpZGVYLFxuICAgICAgICAgICAgeSA9IHJvdyAqIHNjYWxlZFNsaWRlSGVpZ2h0ICsgKHJvdyArIDEpICogc2NhbGVkTWFyZ2luICsgc2NhbGVkVGl0bGVIZWlnaHQgLSBzbGlkZVk7XG4gICAgICAgICAgLy8gTk9URSBkcm9wIHNjaWVudGlmaWMgbm90YXRpb24gZm9yIG51bWJlcnMgbmVhciAwIGFzIGl0IGNvbmZ1c2VzIFdlYktpdFxuICAgICAgICAgIHNsaWRlLnN0eWxlW3RyYW5zZm9ybVByb3BdID0gJ3RyYW5zbGF0ZSgnICsgKHgudG9TdHJpbmcoKS5pbmRleE9mKCdlLScpIDwgMCA/IHggOiAwKSArICdweCwgJyArXG4gICAgICAgICAgICAgICh5LnRvU3RyaW5nKCkuaW5kZXhPZignZS0nKSA8IDAgPyB5IDogMCkgKyAncHgpIHNjYWxlKCcgKyBzY2FsZSArICcpJztcbiAgICAgICAgICAvLyBOT1RFIGFkZCBtYXJnaW4gdG8gbGFzdCBzbGlkZSB0byBsZWF2ZSBnYXAgYmVsb3cgbGFzdCByb3c7IG9ubHkgaG9ub3JlZCBieSBXZWJLaXRcbiAgICAgICAgICBpZiAocm93ICogY29sdW1ucyArIGNvbCA9PT0gbGFzdFNsaWRlSW5kZXgpIHNsaWRlLnN0eWxlLm1hcmdpbkJvdHRvbSA9IG1hcmdpbiArICdweCc7XG4gICAgICAgICAgc2xpZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNsaWRlQ2xpY2ssIGZhbHNlKTtcbiAgICAgICAgICBpZiAoY29sID09PSAoY29sdW1ucyAtIDEpKSB7XG4gICAgICAgICAgICByb3cgKz0gMTtcbiAgICAgICAgICAgIGNvbCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29sICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHJlc2l6ZSkge1xuICAgICAgICAgIHNjcm9sbFNsaWRlSW50b1ZpZXcoc2xpZGVzW2FjdGl2ZVNsaWRlSW5kZXhdLCBhY3RpdmVTbGlkZUluZGV4LCB6b29tRmFjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChudW1UcmFuc2l0aW9ucyA+IDApIHtcbiAgICAgICAgICBzYW1wbGVTbGlkZS5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05FTkQsIChhZnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgJiYgKG51bVRyYW5zaXRpb25zIC09IDEpID09PSAwKSB7XG4gICAgICAgICAgICAgIHJlbW92ZUFmdGVyVHJhbnNpdGlvbigndG8nLCBwYXJlbnRDbGFzc2VzLCB0aGlzKTtcbiAgICAgICAgICAgICAgaWYgKGlzV2ViS2l0ICYmIHBhcmVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgZmx1c2hTdHlsZShwYXJlbnQsICdvdmVyZmxvd1knLCAnYXV0bycsICdzY3JvbGwnKTsgLy8gYXdha2VucyBzY3JvbGxiYXIgZnJvbSB6b21iaWUgc3RhdGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzY3JvbGxTbGlkZUludG9WaWV3KHNsaWRlc1thY3RpdmVTbGlkZUluZGV4XSwgYWN0aXZlU2xpZGVJbmRleCwgem9vbUZhY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzbGlkZXMuZm9yRWFjaChmdW5jdGlvbihzbGlkZSkgeyBmbHVzaFN0eWxlKHNsaWRlKTsgfSk7IC8vIGJ5cGFzcyB0cmFuc2l0aW9uLCBpZiBhbnlcbiAgICAgICAgICBwYXJlbnRDbGFzc2VzLnJlbW92ZSgnYmVzcG9rZS1vdmVydmlldy10bycpO1xuICAgICAgICAgIHNjcm9sbFNsaWRlSW50b1ZpZXcoc2xpZGVzW2FjdGl2ZVNsaWRlSW5kZXhdLCBhY3RpdmVTbGlkZUluZGV4LCB6b29tRmFjdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIE5PVEUgdGhlIG9yZGVyIG9mIG9wZXJhdGlvbiBpbiB0aGlzIG1ldGhvZCBpcyBjcml0aWNhbDsgaGVhdmlseSBpbXBhY3RzIGJlaGF2aW9yICYgdHJhbnNpdGlvbiBzbW9vdGhuZXNzXG4gICAgICBjbG9zZU92ZXJ2aWV3ID0gZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG4gICAgICAgIC8vIElNUE9SVEFOVCBpbnRlbnRpb25hbGx5IHJlc2VsZWN0IGFjdGl2ZSBzbGlkZSB0byByZWFjdGl2YXRlIGJlaGF2aW9yXG4gICAgICAgIGRlY2suc2xpZGUodHlwZW9mIHNlbGVjdGlvbiA9PT0gJ251bWJlcicgPyBzZWxlY3Rpb24gOiBkZWNrLnNsaWRlKCksIHsgc2Nyb2xsSW50b1ZpZXc6IGZhbHNlIH0pO1xuICAgICAgICB2YXIgc2xpZGVzID0gZGVjay5zbGlkZXMsXG4gICAgICAgICAgcGFyZW50ID0gZGVjay5wYXJlbnQsXG4gICAgICAgICAgcGFyZW50Q2xhc3NlcyA9IHBhcmVudC5jbGFzc0xpc3QsXG4gICAgICAgICAgbGFzdFNsaWRlSW5kZXggPSBzbGlkZXMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBzYW1wbGVTbGlkZSA9IGRlY2suc2xpZGUoKSA+IDAgPyBzbGlkZXNbMF0gOiBzbGlkZXNbbGFzdFNsaWRlSW5kZXhdLFxuICAgICAgICAgIHRyYW5zZm9ybVByb3AgPSBnZXRTdHlsZVByb3BlcnR5KHNhbXBsZVNsaWRlLCAndHJhbnNmb3JtJyksXG4gICAgICAgICAgdHJhbnNpdGlvblByb3AgPSBnZXRTdHlsZVByb3BlcnR5KHNhbXBsZVNsaWRlLCAndHJhbnNpdGlvbicpLFxuICAgICAgICAgIHNjYWxlUGFyZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5iZXNwb2tlLXNjYWxlLXBhcmVudCcpLFxuICAgICAgICAgIGJhc2VTY2FsZSxcbiAgICAgICAgICBpc1dlYktpdCA9ICd3ZWJraXRBcHBlYXJhbmNlJyBpbiBwYXJlbnQuc3R5bGU7XG4gICAgICAgIGlmIChzY2FsZVBhcmVudCkge1xuICAgICAgICAgIGJhc2VTY2FsZSA9IGdldFRyYW5zZm9ybVNjYWxlRmFjdG9yKHNjYWxlUGFyZW50LCB0cmFuc2Zvcm1Qcm9wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghKGJhc2VTY2FsZSA9IGdldFpvb21GYWN0b3Ioc2FtcGxlU2xpZGUpKSkge1xuICAgICAgICAgIGJhc2VTY2FsZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFmdGVyVHJhbnNpdGlvbikgcmVtb3ZlQWZ0ZXJUcmFuc2l0aW9uKCd0bycsIHBhcmVudENsYXNzZXMsIHNsaWRlc1swXSwgc2xpZGVzW2xhc3RTbGlkZUluZGV4XSk7XG4gICAgICAgIHZhciB5U2hpZnQgPSBwYXJlbnQuc2Nyb2xsVG9wIC8gYmFzZVNjYWxlLFxuICAgICAgICAgIC8vIHhTaGlmdCBhY2NvdW50cyBmb3IgaG9yaXpvbnRhbCBzaGlmdCB3aGVuIHNjcm9sbGJhciBpcyByZW1vdmVkXG4gICAgICAgICAgeFNoaWZ0ID0gKHBhcmVudC5vZmZzZXRXaWR0aCAtIChzY2FsZVBhcmVudCB8fCBwYXJlbnQpLmNsaWVudFdpZHRoKSAvIDIgLyBiYXNlU2NhbGU7XG4gICAgICAgIHBhcmVudC5zdHlsZS5zY3JvbGxCZWhhdmlvciA9IHBhcmVudC5zdHlsZS5vdmVyZmxvd1kgPSAnJztcbiAgICAgICAgc2xpZGVzLmZvckVhY2goZnVuY3Rpb24oc2xpZGUpIHtcbiAgICAgICAgICBpZiAoaXNXZWJLaXQpIGZsdXNoU3R5bGUoc2xpZGUsICdtYXJnaW5Cb3R0b20nLCAnMCUnLCAnJyk7XG4gICAgICAgICAgc2xpZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNsaWRlQ2xpY2ssIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh5U2hpZnQgfHwgeFNoaWZ0KSB7XG4gICAgICAgICAgc2xpZGVzLmZvckVhY2goZnVuY3Rpb24oc2xpZGUpIHtcbiAgICAgICAgICAgIHZhciBtID0gc2xpZGUuc3R5bGVbdHJhbnNmb3JtUHJvcF0ubWF0Y2goUkVfVFJBTlMpO1xuICAgICAgICAgICAgc2xpZGUuc3R5bGVbdHJhbnNmb3JtUHJvcF0gPSAndHJhbnNsYXRlKCcgKyAocGFyc2VGbG9hdChtWzFdKSAtIHhTaGlmdCkgKyAncHgsICcgKyAocGFyc2VGbG9hdChtWzJdKSAtIHlTaGlmdCkgKyAncHgpIHNjYWxlKCcgKyBtWzNdICsgJyknO1xuICAgICAgICAgICAgZmx1c2hTdHlsZShzbGlkZSwgdHJhbnNpdGlvblByb3AsICdub25lJywgJycpOyAvLyBieXBhc3MgdHJhbnNpdGlvbiwgaWYgYW55XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgIHBhcmVudENsYXNzZXMucmVtb3ZlKCdiZXNwb2tlLW92ZXJ2aWV3Jyk7XG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9wZW5PdmVydmlldywgZmFsc2UpO1xuICAgICAgICAob3ZlcnZpZXdBY3RpdmUgfHwgW10pLmZvckVhY2goZnVuY3Rpb24odW5iaW5kRXZlbnQpIHsgdW5iaW5kRXZlbnQoKTsgfSk7XG4gICAgICAgIG92ZXJ2aWV3QWN0aXZlID0gbnVsbDtcbiAgICAgICAgaWYgKCEhb3B0cy5jb3VudGVyKSBwYXJlbnRDbGFzc2VzLnJlbW92ZSgnYmVzcG9rZS1vdmVydmlldy1jb3VudGVyJyk7XG4gICAgICAgIGlmICghIW9wdHMubG9jYXRpb24pIHVwZGF0ZUxvY2F0aW9uKGZhbHNlKTtcbiAgICAgICAgcGFyZW50Q2xhc3Nlcy5hZGQoJ2Jlc3Bva2Utb3ZlcnZpZXctZnJvbScpO1xuICAgICAgICB2YXIgbnVtVHJhbnNpdGlvbnMgPSBsYXN0U2xpZGVJbmRleCA+IDAgPyBnZXRUcmFuc2l0aW9uUHJvcGVydGllcyhzYW1wbGVTbGlkZSkubGVuZ3RoIDpcbiAgICAgICAgICAgIChnZXRUcmFuc2l0aW9uUHJvcGVydGllcyhzYW1wbGVTbGlkZSkuam9pbignICcpLmluZGV4T2YoJ3RyYW5zZm9ybScpIDwgMCA/IDAgOiAxKTtcbiAgICAgICAgc2xpZGVzLmZvckVhY2goZnVuY3Rpb24oc2xpZGUpIHsgc2xpZGUuc3R5bGVbdHJhbnNmb3JtUHJvcF0gPSAnJzsgfSk7XG4gICAgICAgIGlmIChudW1UcmFuc2l0aW9ucyA+IDApIHtcbiAgICAgICAgICBzYW1wbGVTbGlkZS5hZGRFdmVudExpc3RlbmVyKFRSQU5TSVRJT05FTkQsIChhZnRlclRyYW5zaXRpb24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMgJiYgKG51bVRyYW5zaXRpb25zIC09IDEpID09PSAwKSByZW1vdmVBZnRlclRyYW5zaXRpb24oJ2Zyb20nLCBwYXJlbnRDbGFzc2VzLCB0aGlzKTtcbiAgICAgICAgICB9KSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uKHNsaWRlKSB7IGZsdXNoU3R5bGUoc2xpZGUpOyB9KTsgLy8gYnlwYXNzIHRyYW5zaXRpb24sIGlmIGFueVxuICAgICAgICAgIHBhcmVudENsYXNzZXMucmVtb3ZlKCdiZXNwb2tlLW92ZXJ2aWV3LWZyb20nKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRvZ2dsZU92ZXJ2aWV3ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG92ZXJ2aWV3QWN0aXZlID8gY2xvc2VPdmVydmlldygpIDogb3Blbk92ZXJ2aWV3KCk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgfSxcbiAgICAgIG9uS2V5ZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IEtFWV9PKSB7XG4gICAgICAgICAgaWYgKCFlLmFsdEtleSAmJiAhZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkgJiYgIWUuc2hpZnRLZXkpIHRvZ2dsZU92ZXJ2aWV3KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3ZlcnZpZXdBY3RpdmUpIHtcbiAgICAgICAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgICAgICAgIGNhc2UgS0VZX0VOVDpcbiAgICAgICAgICAgICAgaWYgKCFlLmFsdEtleSAmJiAhZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkgJiYgIWUuc2hpZnRLZXkpIGNsb3NlT3ZlcnZpZXcoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEtFWV9VUDpcbiAgICAgICAgICAgICAgcmV0dXJuIG9uTmF2aWdhdGUoLWNvbHVtbnMsIHsgaW5kZXg6IGRlY2suc2xpZGUoKSB9KTtcbiAgICAgICAgICAgIGNhc2UgS0VZX0ROOlxuICAgICAgICAgICAgICByZXR1cm4gb25OYXZpZ2F0ZShjb2x1bW5zLCB7IGluZGV4OiBkZWNrLnNsaWRlKCkgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIGRlY2sub24oJ2FjdGl2YXRlJywgb25SZWFkeSk7XG4gICAgZGVjay5vbignZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb3Blbk92ZXJ2aWV3LCBmYWxzZSk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlkb3duLCBmYWxzZSk7XG4gICAgfSk7XG4gICAgZGVjay5vbignb3ZlcnZpZXcnLCB0b2dnbGVPdmVydmlldyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5ZG93biwgZmFsc2UpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZGVjaykge1xuICAgIHZhciBwYXJlbnQgPSBkZWNrLnBhcmVudCxcbiAgICAgIGZpcnN0U2xpZGUgPSBkZWNrLnNsaWRlc1swXSxcbiAgICAgIHNsaWRlSGVpZ2h0ID0gZmlyc3RTbGlkZS5vZmZzZXRIZWlnaHQsXG4gICAgICBzbGlkZVdpZHRoID0gZmlyc3RTbGlkZS5vZmZzZXRXaWR0aCxcbiAgICAgIHVzZVpvb20gPSBvcHRpb25zID09PSAnem9vbScgfHwgKCd6b29tJyBpbiBwYXJlbnQuc3R5bGUgJiYgb3B0aW9ucyAhPT0gJ3RyYW5zZm9ybScpLFxuXG4gICAgICB3cmFwID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdiZXNwb2tlLXNjYWxlLXBhcmVudCc7XG4gICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgZWxlbWVudCk7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgICAgfSxcblxuICAgICAgZWxlbWVudHMgPSB1c2Vab29tID8gZGVjay5zbGlkZXMgOiBkZWNrLnNsaWRlcy5tYXAod3JhcCksXG5cbiAgICAgIHRyYW5zZm9ybVByb3BlcnR5ID0gKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgIHZhciBwcmVmaXhlcyA9ICdNb3ogV2Via2l0IE8gbXMnLnNwbGl0KCcgJyk7XG4gICAgICAgIHJldHVybiBwcmVmaXhlcy5yZWR1Y2UoZnVuY3Rpb24oY3VycmVudFByb3BlcnR5LCBwcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBwcm9wZXJ0eSBpbiBwYXJlbnQuc3R5bGUgPyBwcmVmaXggKyBwcm9wZXJ0eSA6IGN1cnJlbnRQcm9wZXJ0eTtcbiAgICAgICAgICB9LCBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH0oJ1RyYW5zZm9ybScpKSxcblxuICAgICAgc2NhbGUgPSB1c2Vab29tID9cbiAgICAgICAgZnVuY3Rpb24ocmF0aW8sIGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLnpvb20gPSByYXRpbztcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uKHJhdGlvLCBlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZVt0cmFuc2Zvcm1Qcm9wZXJ0eV0gPSAnc2NhbGUoJyArIHJhdGlvICsgJyknO1xuICAgICAgICB9LFxuXG4gICAgICBzY2FsZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgeFNjYWxlID0gcGFyZW50Lm9mZnNldFdpZHRoIC8gc2xpZGVXaWR0aCxcbiAgICAgICAgICB5U2NhbGUgPSBwYXJlbnQub2Zmc2V0SGVpZ2h0IC8gc2xpZGVIZWlnaHQ7XG5cbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChzY2FsZS5iaW5kKG51bGwsIE1hdGgubWluKHhTY2FsZSwgeVNjYWxlKSkpO1xuICAgICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBzY2FsZUFsbCk7XG4gICAgc2NhbGVBbGwoKTtcbiAgfTtcblxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qIVxuICogYmVzcG9rZS10aGVtZS1uZWJ1bGEgdjEuMC4xXG4gKlxuICogQ29weXJpZ2h0IDIwMTQsIE1hcmsgRGFsZ2xlaXNoXG4gKiBUaGlzIGNvbnRlbnQgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBcbiAqL1xuXG4hZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShlKTtlbHNle3ZhciBvO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/bz13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9vPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKG89c2VsZik7dmFyIGY9bztmPWYuYmVzcG9rZXx8KGYuYmVzcG9rZT17fSksZj1mLnRoZW1lc3x8KGYudGhlbWVzPXt9KSxmLm5lYnVsYT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcblxudmFyIGNsYXNzZXMgPSBfZGVyZXFfKCdiZXNwb2tlLWNsYXNzZXMnKTtcbnZhciBpbnNlcnRDc3MgPSBfZGVyZXFfKCdpbnNlcnQtY3NzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjc3MgPSBcIi8qISBub3JtYWxpemUuY3NzIHYzLjAuMCB8IE1JVCBMaWNlbnNlIHwgZ2l0LmlvL25vcm1hbGl6ZSAqL2h0bWx7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstbXMtdGV4dC1zaXplLWFkanVzdDoxMDAlOy13ZWJraXQtdGV4dC1zaXplLWFkanVzdDoxMDAlfWJvZHl7bWFyZ2luOjB9YXJ0aWNsZSxhc2lkZSxkZXRhaWxzLGZpZ2NhcHRpb24sZmlndXJlLGZvb3RlcixoZWFkZXIsaGdyb3VwLG1haW4sbmF2LHNlY3Rpb24sc3VtbWFyeXtkaXNwbGF5OmJsb2NrfWF1ZGlvLGNhbnZhcyxwcm9ncmVzcyx2aWRlb3tkaXNwbGF5OmlubGluZS1ibG9jazt2ZXJ0aWNhbC1hbGlnbjpiYXNlbGluZX1hdWRpbzpub3QoW2NvbnRyb2xzXSl7ZGlzcGxheTpub25lO2hlaWdodDowfVtoaWRkZW5dLHRlbXBsYXRle2Rpc3BsYXk6bm9uZX1he2JhY2tncm91bmQ6MCAwfWE6YWN0aXZlLGE6aG92ZXJ7b3V0bGluZTowfWFiYnJbdGl0bGVde2JvcmRlci1ib3R0b206MXB4IGRvdHRlZH1ie2ZvbnQtd2VpZ2h0OjcwMH1kZm57Zm9udC1zdHlsZTppdGFsaWN9aDF7Zm9udC1zaXplOjJlbX1tYXJre2JhY2tncm91bmQ6I2ZmMDtjb2xvcjojMDAwfXNtYWxse2ZvbnQtc2l6ZTo4MCV9c3ViLHN1cHtmb250LXNpemU6NzUlO2xpbmUtaGVpZ2h0OjA7cG9zaXRpb246cmVsYXRpdmU7dmVydGljYWwtYWxpZ246YmFzZWxpbmV9c3Vwe3RvcDotLjVlbX1zdWJ7Ym90dG9tOi0uMjVlbX1pbWd7Ym9yZGVyOjB9c3ZnOm5vdCg6cm9vdCl7b3ZlcmZsb3c6aGlkZGVufWZpZ3VyZXttYXJnaW46MWVtIDQwcHh9aHJ7Ym94LXNpemluZzpjb250ZW50LWJveH1wcmV7b3ZlcmZsb3c6YXV0b31jb2RlLGtiZCxwcmUsc2FtcHtmb250LXNpemU6MWVtfWtiZCxwcmUsc2FtcHtmb250LWZhbWlseTptb25vc3BhY2UsbW9ub3NwYWNlfWJ1dHRvbixpbnB1dCxvcHRncm91cCxzZWxlY3QsdGV4dGFyZWF7Y29sb3I6aW5oZXJpdDtmb250OmluaGVyaXQ7bWFyZ2luOjB9YnV0dG9ue292ZXJmbG93OnZpc2libGV9YnV0dG9uLHNlbGVjdHt0ZXh0LXRyYW5zZm9ybTpub25lfWJ1dHRvbixodG1sIGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdLGlucHV0W3R5cGU9XFxcInJlc2V0XFxcIl0saW5wdXRbdHlwZT1cXFwic3VibWl0XFxcIl17LXdlYmtpdC1hcHBlYXJhbmNlOmJ1dHRvbjtjdXJzb3I6cG9pbnRlcn1idXR0b25bZGlzYWJsZWRdLGh0bWwgaW5wdXRbZGlzYWJsZWRde2N1cnNvcjpkZWZhdWx0fWJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixpbnB1dDo6LW1vei1mb2N1cy1pbm5lcntib3JkZXI6MDtwYWRkaW5nOjB9aW5wdXR7bGluZS1oZWlnaHQ6bm9ybWFsfWlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0saW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXXtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzowfWlucHV0W3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLGlucHV0W3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9ue2hlaWdodDphdXRvfWlucHV0W3R5cGU9XFxcInNlYXJjaFxcXCJdey13ZWJraXQtYXBwZWFyYW5jZTp0ZXh0ZmllbGQ7Ym94LXNpemluZzpjb250ZW50LWJveH1pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixpbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbnstd2Via2l0LWFwcGVhcmFuY2U6bm9uZX1maWVsZHNldHtib3JkZXI6MXB4IHNvbGlkIHNpbHZlcjttYXJnaW46MCAycHg7cGFkZGluZzouMzVlbSAuNjI1ZW0gLjc1ZW19bGVnZW5ke2JvcmRlcjowO3BhZGRpbmc6MH10ZXh0YXJlYXtvdmVyZmxvdzphdXRvfW9wdGdyb3Vwe2ZvbnQtd2VpZ2h0OjcwMH10YWJsZXtib3JkZXItY29sbGFwc2U6Y29sbGFwc2U7Ym9yZGVyLXNwYWNpbmc6MH10ZCx0aCwqe3BhZGRpbmc6MH0qe21hcmdpbjowfWh0bWx7LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OmF1dG87LW1zLXRleHQtc2l6ZS1hZGp1c3Q6YXV0bzt0ZXh0LXNpemUtYWRqdXN0OmF1dG99LmJlc3Bva2UtcGFyZW50e2ZvbnQtc2l6ZToxLjVlbTtiYWNrZ3JvdW5kOiMxMTE7Y29sb3I6I2RkZDtmb250LWZhbWlseTpmdXR1cmEsaGVsdmV0aWNhLGFyaWFsLGFyaWFsLHNhbnMtc2VyaWY7b3ZlcmZsb3c6aGlkZGVuO3RleHQtYWxpZ246Y2VudGVyOy13ZWJraXQtdHJhbnNpdGlvbjpiYWNrZ3JvdW5kIDFzIGVhc2U7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIDFzIGVhc2U7YmFja2dyb3VuZC1wb3NpdGlvbjo1MCUgNTAlfS5iZXNwb2tlLXBhcmVudCwuYmVzcG9rZS1zY2FsZS1wYXJlbnR7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjB9LmJlc3Bva2Utc2NhbGUtcGFyZW50e3BvaW50ZXItZXZlbnRzOm5vbmU7ei1pbmRleDoxfS5iZXNwb2tlLXNjYWxlLXBhcmVudCAuYmVzcG9rZS1hY3RpdmV7cG9pbnRlci1ldmVudHM6YXV0b30uYmVzcG9rZS1zbGlkZXstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuNXMgZWFzZTt0cmFuc2l0aW9uOm9wYWNpdHkgLjVzIGVhc2U7d2lkdGg6OTQwcHg7aGVpZ2h0OjQ4MHB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luLWxlZnQ6LTQ3MHB4O21hcmdpbi10b3A6LTI0MHB4O2Rpc3BsYXk6LXdlYmtpdC1ib3g7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7LXdlYmtpdC1ib3gtb3JpZW50OnZlcnRpY2FsOy13ZWJraXQtYm94LWRpcmVjdGlvbjpub3JtYWw7LXdlYmtpdC1mbGV4LWRpcmVjdGlvbjpjb2x1bW47LW1zLWZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4LWRpcmVjdGlvbjpjb2x1bW47LXdlYmtpdC1ib3gtcGFjazpjZW50ZXI7LXdlYmtpdC1qdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyOy1tcy1mbGV4LXBhY2s6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7LXdlYmtpdC1ib3gtYWxpZ246Y2VudGVyOy13ZWJraXQtYWxpZ24taXRlbXM6Y2VudGVyOy1tcy1mbGV4LWFsaWduOmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7ei1pbmRleDoxfS5iZXNwb2tlLWFjdGl2ZXstd2Via2l0LXRyYW5zaXRpb24tZGVsYXk6LjVzO3RyYW5zaXRpb24tZGVsYXk6LjVzfS5iZXNwb2tlLWFjdGl2ZVtkYXRhLWJlc3Bva2UtYmFja2Ryb3Bdey13ZWJraXQtdHJhbnNpdGlvbi1kZWxheTouNzVzO3RyYW5zaXRpb24tZGVsYXk6Ljc1c30uYmVzcG9rZS1pbmFjdGl2ZXtvcGFjaXR5OjA7cG9pbnRlci1ldmVudHM6bm9uZX0uYmVzcG9rZS1iYWNrZHJvcHstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAxcyBlYXNlO3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDtyaWdodDowO2JvdHRvbTowfS5iZXNwb2tlLXByb2dyZXNzLXBhcmVudHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6LjN2dzt6LWluZGV4OjF9LmJlc3Bva2UtcHJvZ3Jlc3MtYmFye2JhY2tncm91bmQ6I2RkZDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7aGVpZ2h0OjEwMCU7LXdlYmtpdC10cmFuc2l0aW9uOndpZHRoIDFzIGVhc2U7dHJhbnNpdGlvbjp3aWR0aCAxcyBlYXNlfS5iZXNwb2tlLWJ1bGxldHstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuM3MgZWFzZTt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGVhc2V9LmJlc3Bva2UtYnVsbGV0LWluYWN0aXZle29wYWNpdHk6MH1zdHJvbmd7Zm9udC13ZWlnaHQ6NDAwfWhye3dpZHRoOjUwJTttYXJnaW46MXJlbSBhdXRvO2hlaWdodDoxcHg7Ym9yZGVyOjA7YmFja2dyb3VuZDojZGRkfWgzLHAsbGl7cGFkZGluZy1sZWZ0OjIwcHg7cGFkZGluZy1yaWdodDoyMHB4fWgzLGg0LHAsbGkscHJle2ZvbnQtd2VpZ2h0OjIwMH1oMXtsaW5lLWhlaWdodDoxLjRlbTtwYWRkaW5nOjFlbTtib3JkZXI6MXB4IHNvbGlkICNkZGQ7Ym9yZGVyLWxlZnQtd2lkdGg6MDtib3JkZXItcmlnaHQtd2lkdGg6MDttaW4td2lkdGg6OGVtfWgxLGgye2xldHRlci1zcGFjaW5nOi4zZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2ZvbnQtd2VpZ2h0OjQwMDttYXJnaW46LjE3ZW0gMDtwb3NpdGlvbjpyZWxhdGl2ZX1oMntsaW5lLWhlaWdodDoxLjFlbTtwYWRkaW5nOjAgMCAwIC4zZW19aDN7Zm9udC1mYW1pbHk6ZGlkb3QsdGltZXMgbmV3IHJvbWFuLHNlcmlmO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtc2l6ZToxLjJlbTtsaW5lLWhlaWdodDoxLjZlbTttYXJnaW46LjVlbSAwfWg0e3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtmb250LXNpemU6LjhlbTtsaW5lLWhlaWdodDoxLjhlbTtsZXR0ZXItc3BhY2luZzouM2VtO21hcmdpbjoxZW0gMH11bCxvbHtwYWRkaW5nOjA7bWFyZ2luOjA7dGV4dC1hbGlnbjpsZWZ0fWxpe2xpc3Qtc3R5bGU6bm9uZTttYXJnaW46LjJlbTtmb250LXN0eWxlOm5vcm1hbDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVYKC02cHgpOy1tcy10cmFuc2Zvcm06dHJhbnNsYXRlWCgtNnB4KTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNnB4KX1saTpiZWZvcmV7Y29udGVudDonXFxcXDIwMTQnO21hcmdpbi1yaWdodDo0cHh9cHJle2JhY2tncm91bmQ6bm9uZSFpbXBvcnRhbnR9Y29kZXtmb250LWZhbWlseTpwcmVzdGlnZSBlbGl0ZSBzdGQsY29uc29sYXMsY291cmllciBuZXcsbW9ub3NwYWNlIWltcG9ydGFudDtmb250LXN0eWxlOm5vcm1hbDtmb250LXdlaWdodDoyMDAhaW1wb3J0YW50O3RleHQtYWxpZ246bGVmdH1he3BhZGRpbmctbGVmdDouM2VtO2NvbG9yOmN1cnJlbnRDb2xvcjt0ZXh0LWRlY29yYXRpb246bm9uZTtib3JkZXItYm90dG9tOjFweCBzb2xpZCBjdXJyZW50Q29sb3J9LmVtcGhhdGlje2JhY2tncm91bmQ6I2YzMH0uc2luZ2xlLXdvcmRze3dvcmQtc3BhY2luZzo5OTk5cHg7bGluZS1oZWlnaHQ6Mi45ZW07b3ZlcmZsb3c6aGlkZGVufS5iZXNwb2tlLWJhY2tkcm9we29wYWNpdHk6MDstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAxcyBlYXNlLC13ZWJraXQtdHJhbnNmb3JtIDZzIGVhc2U7dHJhbnNpdGlvbjpvcGFjaXR5IDFzIGVhc2UsdHJhbnNmb3JtIDZzIGVhc2U7YmFja2dyb3VuZC1zaXplOmNvdmVyO2JhY2tncm91bmQtcG9zaXRpb246NTAlIDUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApc2NhbGUoMS4zKTt0cmFuc2Zvcm06dHJhbnNsYXRlWigwKXNjYWxlKDEuMyl9LmJlc3Bva2UtYmFja2Ryb3AtYWN0aXZlLC5iZXNwb2tlLWJhY2tkcm9wLWJlZm9yZXstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApO3RyYW5zZm9ybTp0cmFuc2xhdGVaKDApfS5iZXNwb2tlLWJhY2tkcm9wLWJlZm9yZXstd2Via2l0LXRyYW5zaXRpb24tZGVsYXk6LjJzO3RyYW5zaXRpb24tZGVsYXk6LjJzfS5iZXNwb2tlLWJhY2tkcm9wLWFjdGl2ZXtvcGFjaXR5Oi41fVwiO1xuICBpbnNlcnRDc3MoY3NzLCB7IHByZXBlbmQ6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGRlY2spIHtcbiAgICBjbGFzc2VzKCkoZGVjayk7XG4gIH07XG59O1xuXG59LHtcImJlc3Bva2UtY2xhc3Nlc1wiOjIsXCJpbnNlcnQtY3NzXCI6M31dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGRlY2spIHtcbiAgICB2YXIgYWRkQ2xhc3MgPSBmdW5jdGlvbihlbCwgY2xzKSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2Jlc3Bva2UtJyArIGNscyk7XG4gICAgICB9LFxuXG4gICAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsLCBjbHMpIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lXG4gICAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnYmVzcG9rZS0nICsgY2xzICsnKFxcXFxzfCQpJywgJ2cnKSwgJyAnKVxuICAgICAgICAgIC50cmltKCk7XG4gICAgICB9LFxuXG4gICAgICBkZWFjdGl2YXRlID0gZnVuY3Rpb24oZWwsIGluZGV4KSB7XG4gICAgICAgIHZhciBhY3RpdmVTbGlkZSA9IGRlY2suc2xpZGVzW2RlY2suc2xpZGUoKV0sXG4gICAgICAgICAgb2Zmc2V0ID0gaW5kZXggLSBkZWNrLnNsaWRlKCksXG4gICAgICAgICAgb2Zmc2V0Q2xhc3MgPSBvZmZzZXQgPiAwID8gJ2FmdGVyJyA6ICdiZWZvcmUnO1xuXG4gICAgICAgIFsnYmVmb3JlKC1cXFxcZCspPycsICdhZnRlcigtXFxcXGQrKT8nLCAnYWN0aXZlJywgJ2luYWN0aXZlJ10ubWFwKHJlbW92ZUNsYXNzLmJpbmQobnVsbCwgZWwpKTtcblxuICAgICAgICBpZiAoZWwgIT09IGFjdGl2ZVNsaWRlKSB7XG4gICAgICAgICAgWydpbmFjdGl2ZScsIG9mZnNldENsYXNzLCBvZmZzZXRDbGFzcyArICctJyArIE1hdGguYWJzKG9mZnNldCldLm1hcChhZGRDbGFzcy5iaW5kKG51bGwsIGVsKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICBhZGRDbGFzcyhkZWNrLnBhcmVudCwgJ3BhcmVudCcpO1xuICAgIGRlY2suc2xpZGVzLm1hcChmdW5jdGlvbihlbCkgeyBhZGRDbGFzcyhlbCwgJ3NsaWRlJyk7IH0pO1xuXG4gICAgZGVjay5vbignYWN0aXZhdGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICBkZWNrLnNsaWRlcy5tYXAoZGVhY3RpdmF0ZSk7XG4gICAgICBhZGRDbGFzcyhlLnNsaWRlLCAnYWN0aXZlJyk7XG4gICAgICByZW1vdmVDbGFzcyhlLnNsaWRlLCAnaW5hY3RpdmUnKTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbn0se31dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xudmFyIGluc2VydGVkID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcywgb3B0aW9ucykge1xuICAgIGlmIChpbnNlcnRlZFtjc3NdKSByZXR1cm47XG4gICAgaW5zZXJ0ZWRbY3NzXSA9IHRydWU7XG4gICAgXG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG5cbiAgICBpZiAoJ3RleHRDb250ZW50JyBpbiBlbGVtKSB7XG4gICAgICBlbGVtLnRleHRDb250ZW50ID0gY3NzO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICB9XG4gICAgXG4gICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucHJlcGVuZCkge1xuICAgICAgICBoZWFkLmluc2VydEJlZm9yZShlbGVtLCBoZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgfVxufTtcblxufSx7fV19LHt9LFsxXSlcbigxKVxufSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZGVjaykge1xuICAgIHZhciBheGlzID0gb3B0aW9ucyA9PSAndmVydGljYWwnID8gJ1knIDogJ1gnLFxuICAgICAgc3RhcnRQb3NpdGlvbixcbiAgICAgIGRlbHRhO1xuXG4gICAgZGVjay5wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGUudG91Y2hlc1swXVsncGFnZScgKyBheGlzXTtcbiAgICAgICAgZGVsdGEgPSAwO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVjay5wYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT0gMSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRlbHRhID0gZS50b3VjaGVzWzBdWydwYWdlJyArIGF4aXNdIC0gc3RhcnRQb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlY2sucGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpID4gNTApIHtcbiAgICAgICAgZGVja1tkZWx0YSA+IDAgPyAncHJldicgOiAnbmV4dCddKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59O1xuIiwidmFyIGZyb20gPSBmdW5jdGlvbihvcHRzLCBwbHVnaW5zKSB7XG4gIHZhciBwYXJlbnQgPSAob3B0cy5wYXJlbnQgfHwgb3B0cykubm9kZVR5cGUgPT09IDEgPyAob3B0cy5wYXJlbnQgfHwgb3B0cykgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdHMucGFyZW50IHx8IG9wdHMpLFxuICAgIHNsaWRlcyA9IFtdLmZpbHRlci5jYWxsKHR5cGVvZiBvcHRzLnNsaWRlcyA9PT0gJ3N0cmluZycgPyBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChvcHRzLnNsaWRlcykgOiAob3B0cy5zbGlkZXMgfHwgcGFyZW50LmNoaWxkcmVuKSwgZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLm5vZGVOYW1lICE9PSAnU0NSSVBUJzsgfSksXG4gICAgYWN0aXZlU2xpZGUgPSBzbGlkZXNbMF0sXG4gICAgbGlzdGVuZXJzID0ge30sXG5cbiAgICBhY3RpdmF0ZSA9IGZ1bmN0aW9uKGluZGV4LCBjdXN0b21EYXRhKSB7XG4gICAgICBpZiAoIXNsaWRlc1tpbmRleF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaXJlKCdkZWFjdGl2YXRlJywgY3JlYXRlRXZlbnREYXRhKGFjdGl2ZVNsaWRlLCBjdXN0b21EYXRhKSk7XG4gICAgICBhY3RpdmVTbGlkZSA9IHNsaWRlc1tpbmRleF07XG4gICAgICBmaXJlKCdhY3RpdmF0ZScsIGNyZWF0ZUV2ZW50RGF0YShhY3RpdmVTbGlkZSwgY3VzdG9tRGF0YSkpO1xuICAgIH0sXG5cbiAgICBzbGlkZSA9IGZ1bmN0aW9uKGluZGV4LCBjdXN0b21EYXRhKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBmaXJlKCdzbGlkZScsIGNyZWF0ZUV2ZW50RGF0YShzbGlkZXNbaW5kZXhdLCBjdXN0b21EYXRhKSkgJiYgYWN0aXZhdGUoaW5kZXgsIGN1c3RvbURhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNsaWRlcy5pbmRleE9mKGFjdGl2ZVNsaWRlKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RlcCA9IGZ1bmN0aW9uKG9mZnNldCwgY3VzdG9tRGF0YSkge1xuICAgICAgdmFyIHNsaWRlSW5kZXggPSBzbGlkZXMuaW5kZXhPZihhY3RpdmVTbGlkZSkgKyBvZmZzZXQ7XG5cbiAgICAgIGZpcmUob2Zmc2V0ID4gMCA/ICduZXh0JyA6ICdwcmV2JywgY3JlYXRlRXZlbnREYXRhKGFjdGl2ZVNsaWRlLCBjdXN0b21EYXRhKSkgJiYgYWN0aXZhdGUoc2xpZGVJbmRleCwgY3VzdG9tRGF0YSk7XG4gICAgfSxcblxuICAgIG9uID0gZnVuY3Rpb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgKGxpc3RlbmVyc1tldmVudE5hbWVdIHx8IChsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdKSkucHVzaChjYWxsYmFjayk7XG4gICAgICByZXR1cm4gb2ZmLmJpbmQobnVsbCwgZXZlbnROYW1lLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIG9mZiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdID0gKGxpc3RlbmVyc1tldmVudE5hbWVdIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24obGlzdGVuZXIpIHsgcmV0dXJuIGxpc3RlbmVyICE9PSBjYWxsYmFjazsgfSk7XG4gICAgfSxcblxuICAgIGZpcmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGV2ZW50RGF0YSkge1xuICAgICAgcmV0dXJuIChsaXN0ZW5lcnNbZXZlbnROYW1lXSB8fCBbXSlcbiAgICAgICAgLnJlZHVjZShmdW5jdGlvbihub3RDYW5jZWxsZWQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuIG5vdENhbmNlbGxlZCAmJiBjYWxsYmFjayhldmVudERhdGEpICE9PSBmYWxzZTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZUV2ZW50RGF0YSA9IGZ1bmN0aW9uKGVsLCBldmVudERhdGEpIHtcbiAgICAgIGV2ZW50RGF0YSA9IGV2ZW50RGF0YSB8fCB7fTtcbiAgICAgIGV2ZW50RGF0YS5pbmRleCA9IHNsaWRlcy5pbmRleE9mKGVsKTtcbiAgICAgIGV2ZW50RGF0YS5zbGlkZSA9IGVsO1xuICAgICAgcmV0dXJuIGV2ZW50RGF0YTtcbiAgICB9LFxuXG4gICAgZGVjayA9IHtcbiAgICAgIG9uOiBvbixcbiAgICAgIG9mZjogb2ZmLFxuICAgICAgZmlyZTogZmlyZSxcbiAgICAgIHNsaWRlOiBzbGlkZSxcbiAgICAgIG5leHQ6IHN0ZXAuYmluZChudWxsLCAxKSxcbiAgICAgIHByZXY6IHN0ZXAuYmluZChudWxsLCAtMSksXG4gICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgIHNsaWRlczogc2xpZGVzXG4gICAgfTtcblxuICAocGx1Z2lucyB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICBwbHVnaW4oZGVjayk7XG4gIH0pO1xuXG4gIGFjdGl2YXRlKDApO1xuXG4gIHJldHVybiBkZWNrO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZyb206IGZyb21cbn07XG4iLCJ2YXIgaW5zZXJ0ZWQgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzLCBvcHRpb25zKSB7XG4gICAgaWYgKGluc2VydGVkW2Nzc10pIHJldHVybjtcbiAgICBpbnNlcnRlZFtjc3NdID0gdHJ1ZTtcbiAgICBcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH1cbiAgICBcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVwZW5kKSB7XG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKGVsZW0sIGhlYWQuY2hpbGROb2Rlc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwidmFyIGJlc3Bva2UgPSByZXF1aXJlKCdiZXNwb2tlJyksXG4gIG5lYnVsYSA9IHJlcXVpcmUoJ2Jlc3Bva2UtdGhlbWUtbmVidWxhJyksXG4gIGtleXMgPSByZXF1aXJlKCdiZXNwb2tlLWtleXMnKSxcbiAgdG91Y2ggPSByZXF1aXJlKCdiZXNwb2tlLXRvdWNoJyksXG4gIGJ1bGxldHMgPSByZXF1aXJlKCdiZXNwb2tlLWJ1bGxldHMnKSxcbiAgc2NhbGUgPSByZXF1aXJlKCdiZXNwb2tlLXNjYWxlJyksXG4gIGJhY2tkcm9wID0gcmVxdWlyZSgnYmVzcG9rZS1iYWNrZHJvcCcpLFxuICBvdmVydmlldyA9IHJlcXVpcmUoJ2Jlc3Bva2Utb3ZlcnZpZXcnKSxcbiAgb25zdGFnZSA9IHJlcXVpcmUoJ2Jlc3Bva2Utb25zdGFnZScpLFxuICBoYXNoID0gcmVxdWlyZSgnYmVzcG9rZS1oYXNoJyk7XG5cbnZhciBkZWNrID0gYmVzcG9rZS5mcm9tKCdhcnRpY2xlJywgW1xuICBuZWJ1bGEoKSxcbiAga2V5cygpLFxuICBvdmVydmlldygpLFxuICB0b3VjaCgpLFxuICBidWxsZXRzKCd1bDpub3QoLm5vLWJ1bGxldHMpIGxpLCBvbDpub3QoLm5vLWJ1bGxldHMpIGxpLCAuYnVsbGV0JyksXG4gIHNjYWxlKCksXG4gIGJhY2tkcm9wKCksXG4gIG9uc3RhZ2UoKSxcbiAgaGFzaCgpXG5dKTtcblxuZGVjay5vbihcImFjdGl2YXRlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKGV2ZW50LmluZGV4KVxuICBpZiAoZXZlbnQuc2xpZGUuaW5uZXJIVE1MLmluY2x1ZGVzKCdhc2NpaW5lbWEnKSkge1xuICAgIGV2ZW50LnNsaWRlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2wtYmFyJylbMF0uc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmUnKVxuICAgIHZhciBjbGljayA9IG5ldyBNb3VzZUV2ZW50KFwiY2xpY2tcIiwge1xuICAgICAgICBcInZpZXdcIjogd2luZG93LFxuICAgICAgICBcImJ1YmJsZXNcIjogdHJ1ZSxcbiAgICAgICAgXCJjYW5jZWxhYmxlXCI6IGZhbHNlXG4gICAgfSk7XG4gICAgdmFyIHBsYXllciA9IGV2ZW50LnNsaWRlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhc2NpaW5lbWEtcGxheWVyJylbMF1cbiAgICBjb25zb2xlLmxvZygndGltZScsIHBsYXllci5jdXJyZW50VGltZSlcbiAgICBwbGF5ZXIuY3VycmVudFRpbWUgPSAwXG4gICAgcGxheWVyLnBsYXkoKVxuICB9XG5cbiAgaWYgKGV2ZW50LnNsaWRlLmlubmVySFRNTC5pbmNsdWRlcygndmlkZW8nKSkge1xuICAgIHZhciBwbGF5ZXIgPSBldmVudC5zbGlkZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKVswXVxuICAgIHBsYXllci5jdXJyZW50VGltZSA9IDBcbiAgICBwbGF5ZXIucGxheSgpXG4gIH1cblxuICAvLyBUT0RPIHJlc2V0IGdpZlxufSlcblxucmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9wcmlzbS9wcmlzbS5qc1wiKTtcbnJlcXVpcmUoXCIuLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvcHJpc20tY2xvanVyZS9wcmlzbS5jbG9qdXJlLmpzXCIpO1xuIl19
