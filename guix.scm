;; Excel-Economic-Numbers-Tool - Guix Package Definition
;; Run: guix shell -D -f guix.scm

(use-modules (guix packages)
             (guix gexp)
             (guix git-download)
             (guix build-system node)
             ((guix licenses) #:prefix license:)
             (gnu packages base))

(define-public excel_economic_numbers_tool
  (package
    (name "Excel-Economic-Numbers-Tool")
    (version "0.1.0")
    (source (local-file "." "Excel-Economic-Numbers-Tool-checkout"
                        #:recursive? #t
                        #:select? (git-predicate ".")))
    (build-system node-build-system)
    (synopsis "ReScript application")
    (description "ReScript application - part of the RSR ecosystem.")
    (home-page "https://github.com/hyperpolymath/Excel-Economic-Numbers-Tool")
    (license license:agpl3+)))

;; Return package for guix shell
excel_economic_numbers_tool
