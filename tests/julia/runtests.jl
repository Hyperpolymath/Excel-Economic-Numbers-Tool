using Test

@testset "Economic Toolkit Tests" begin
    @testset "Utility Tests" begin
        include("test_rate_limiter.jl")
    end

    @testset "Formula Tests" begin
        include("test_elasticity.jl")
    end

    # Add more test suites as needed
    # @testset "Data Source Tests" begin
    #     include("test_fred.jl")
    #     include("test_worldbank.jl")
    # end
end
