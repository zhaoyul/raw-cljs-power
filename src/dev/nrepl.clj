(ns dev.nrepl
  "Lightweight nREPL entrypoint for interactive ClojureScript development.

  Usage:
    clojure -M:nrepl

  This starts an nREPL server with Piggieback middleware so ClojureScript
  can be evaluated via a connected client (e.g., CIDER/Calva)."
  (:require
   [nrepl.server :as nrepl]
   [cider.piggieback :as piggieback]
   [cljs.repl.browser :as browser]))

(defonce ^:private server (atom nil))

(defn start!
  ([] (start! 8777))
  ([port]
   (when-not @server
     (reset! server
             (nrepl/start-server
              :bind "127.0.0.1"
              :port port
              :handler (nrepl/default-handler #'piggieback/wrap-cljs-repl))))
   (println (format "nREPL server started on port %s" port))
   (println "Connect then run (cider.piggieback/cljs-repl (cljs.repl.browser/repl-env))")
   @server))

(defn stop! []
  (when-let [s @server]
    (nrepl/stop-server s)
    (reset! server nil)
    (println "nREPL server stopped")))

(defn -main [& _args]
  (start!)
  ;; Keep process alive without busy-looping
  @(promise))
