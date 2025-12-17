;;; STATE.scm - Project Checkpoint
;;; excel-economic-numbers-tool
;;; Format: Guile Scheme S-expressions
;;; Purpose: Preserve AI conversation context across sessions
;;; Reference: https://github.com/hyperpolymath/state.scm

;; SPDX-License-Identifier: AGPL-3.0-or-later
;; SPDX-FileCopyrightText: 2025 Jonathan D.A. Jewell

;;;============================================================================
;;; METADATA
;;;============================================================================

(define metadata
  '((version . "0.1.1")
    (schema-version . "1.0")
    (created . "2025-12-15")
    (updated . "2025-12-17")
    (project . "excel-economic-numbers-tool")
    (repo . "github.com/hyperpolymath/excel-economic-numbers-tool")))

;;;============================================================================
;;; PROJECT CONTEXT
;;;============================================================================

(define project-context
  '((name . "excel-economic-numbers-tool")
    (tagline . "> Cross-platform Excel/LibreOffice add-in for economic modeling, data analysis, and investigative research")
    (version . "0.1.1")
    (license . "AGPL-3.0-or-later")
    (rsr-compliance . "gold-achieved")

    (tech-stack
     ((primary . "Julia (backend), ReScript (frontend), TypeScript (adapters)")
      (ci-cd . "GitHub Actions + GitLab CI + Bitbucket Pipelines")
      (security . "CodeQL + OSSF Scorecard + Dependabot + Snyk")))))

;;;============================================================================
;;; CURRENT POSITION
;;;============================================================================

(define current-position
  '((phase . "v0.1 - Foundation and RSR Gold Compliance")
    (overall-completion . 35)

    (components
     ((rsr-compliance
       ((status . "complete")
        (completion . 100)
        (notes . "All workflows SHA-pinned, SPDX headers, permissions declared")))

      (security-infrastructure
       ((status . "complete")
        (completion . 100)
        (notes . "CodeQL, OSSF Scorecard, Dependabot, security.txt RFC 9116")))

      (documentation
       ((status . "foundation")
        (completion . 40)
        (notes . "README, META/ECOSYSTEM/STATE.scm, CLAUDE.md complete")))

      (testing
       ((status . "scaffolding")
        (completion . 15)
        (notes . "CI/CD test infrastructure ready, coverage tools configured")))

      (core-functionality
       ((status . "in-progress")
        (completion . 25)
        (notes . "Julia backend structure, data source clients started")))

      (data-sources
       ((status . "planned")
        (completion . 10)
        (notes . "FRED, World Bank clients scaffolded, 8+ sources planned")))))

    (working-features
     ("RSR Gold-compliant CI/CD pipeline"
      "Multi-platform mirroring (GitHub, GitLab, Bitbucket)"
      "SPDX license headers on all files"
      "SHA-pinned GitHub Actions (all 13 workflows)"
      "Permissions declarations on all workflows"
      "CodeQL security analysis"
      "OSSF Scorecard integration"
      "Dependabot automated updates"
      "RFC 9116 security.txt compliance"
      "Well-known ecosystem files (ai.txt, humans.txt)"))))

;;;============================================================================
;;; ROUTE TO MVP
;;;============================================================================

(define route-to-mvp
  '((target-version . "1.0.0")
    (definition . "Production-ready Excel/LibreOffice add-in with 10+ data sources")

    (milestones
     ((v0.2
       ((name . "Core Data Sources")
        (status . "next")
        (items
         ("Complete FRED client implementation"
          "Complete World Bank client implementation"
          "Implement SQLite caching layer"
          "Add rate limiting infrastructure"
          "Basic test coverage (>50%)"))))

      (v0.3
       ((name . "Additional Data Sources")
        (status . "pending")
        (items
         ("IMF data source client"
          "OECD data source client"
          "DBnomics aggregator client"
          "ECB data source client"
          "Unified search across sources"))))

      (v0.4
       ((name . "Economic Formulas")
        (status . "pending")
        (items
         ("Elasticity calculations"
          "GDP growth formulas (YoY, QoQ, MoM, CAGR)"
          "Lorenz curve and Gini coefficient"
          "Constraint propagation engine"))))

      (v0.5
       ((name . "Cross-Platform UI")
        (status . "pending")
        (items
         ("Office.js adapter complete"
          "LibreOffice UNO adapter complete"
          "ReScript ribbon components"
          "Task pane implementations"
          "Test coverage > 70%"))))

      (v0.8
       ((name . "Beta Release")
        (status . "pending")
        (items
         ("All 10 data sources operational"
          "Full formula library"
          "Performance optimization"
          "User documentation"
          "Beta testing feedback cycle"))))

      (v1.0
       ((name . "Production Release")
        (status . "pending")
        (items
         ("Test coverage > 95%"
          "Security audit complete"
          "Performance benchmarks met"
          "User documentation complete"
          "Excel add-in certified"
          "LibreOffice extension published"))))))))

;;;============================================================================
;;; BLOCKERS & ISSUES
;;;============================================================================

(define blockers-and-issues
  '((critical
     ())  ;; No critical blockers

    (high-priority
     ())  ;; No high-priority blockers

    (medium-priority
     ((test-coverage
       ((description . "Test infrastructure needs implementation")
        (impact . "Risk of regressions during development")
        (needed . "Julia and TypeScript test suites")))

      (ts-to-rescript
       ((description . "TypeScript to ReScript migration pending")
        (impact . "Policy compliance and type safety")
        (needed . "Convert existing TS adapters to ReScript")))))

    (low-priority
     ((data-source-apis
       ((description . "Some data source APIs require key registration")
        (impact . "May limit testing without keys")
        (needed . "Document API key requirements")))))))

;;;============================================================================
;;; CRITICAL NEXT ACTIONS
;;;============================================================================

(define critical-next-actions
  '((immediate
     (("Implement FRED client with tests" . high)
      ("Implement World Bank client with tests" . high)
      ("Set up SQLite cache layer" . high)
      ("Add rate limiter module" . medium)))

    (this-week
     (("Complete v0.2 data source clients" . high)
      ("Add unit tests for Julia modules" . high)
      ("Document API key setup" . medium)))

    (this-month
     (("Reach v0.3 milestone (5 data sources)" . high)
      ("Begin economic formula implementation" . medium)
      ("Start ReScript UI components" . medium)))))

;;;============================================================================
;;; SESSION HISTORY
;;;============================================================================

(define session-history
  '((snapshots
     ((date . "2025-12-17")
      (session . "security-compliance-audit")
      (accomplishments
       ("Fixed all 13 GitHub workflows for RSR compliance"
        "Added SPDX headers to all workflows"
        "Added permissions declarations to all workflows"
        "SHA-pinned all GitHub Actions"
        "Updated STATE.scm with detailed roadmap"
        "Achieved RSR Gold compliance status"))
      (notes . "Complete security and compliance audit and fixes"))

     ((date . "2025-12-15")
      (session . "initial-state-creation")
      (accomplishments
       ("Added META.scm, ECOSYSTEM.scm, STATE.scm"
        "Established RSR compliance"
        "Created initial project checkpoint"))
      (notes . "First STATE.scm checkpoint created via automated script")))))

;;;============================================================================
;;; HELPER FUNCTIONS (for Guile evaluation)
;;;============================================================================

(define (get-completion-percentage component)
  "Get completion percentage for a component"
  (let ((comp (assoc component (cdr (assoc 'components current-position)))))
    (if comp
        (cdr (assoc 'completion (cdr comp)))
        #f)))

(define (get-blockers priority)
  "Get blockers by priority level"
  (cdr (assoc priority blockers-and-issues)))

(define (get-milestone version)
  "Get milestone details by version"
  (assoc version (cdr (assoc 'milestones route-to-mvp))))

;;;============================================================================
;;; EXPORT SUMMARY
;;;============================================================================

(define state-summary
  '((project . "excel-economic-numbers-tool")
    (version . "0.1.1")
    (overall-completion . 35)
    (next-milestone . "v0.2 - Core Data Sources")
    (critical-blockers . 0)
    (high-priority-issues . 0)
    (updated . "2025-12-17")))

;;; End of STATE.scm
